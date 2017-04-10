/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { stateToHTML } from 'draft-js-export-html';
import {
  CompositeDecorator,
  Editor,
  EditorState,
  RichUtils,
  ContentState,
  convertFromHTML,
} from 'draft-js';
import ToolBar from './ToolBar';
import Icon from '../../../utils/icons';
import { formatStringWithCode } from '../../../utils/helpers';
import './RichText.scss';

function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'LINK'
      );
    },
    callback,
  );
}

const Link = (props) => {
  const { url } = props.contentState.getEntity(props.entityKey).getData();
  return (
    <a href={url} style={{ color: '#3b5998', textDecoration: 'underline' }}>
      {props.children}
    </a>
  );
};

Link.propTypes = {
  contentState: PropTypes.object.isRequired,
  children: PropTypes.array.isRequired,
  entityKey: PropTypes.string.isRequired,
};

export default class RichText extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    instructions: PropTypes.string,
    defaultValue: PropTypes.string,
    required: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    instructions: null,
    defaultValue: null,
    contentState: null,
  }

  static validate(val) {
    console.log('Validating rich text!', val);
    return val !== '' && val !== '<p><br></p>';
  }

  constructor(props) {
    super(props);
    this.toggleInlineStyle = this.toggleInlineStyle.bind(this);
    this.toggleBlockType = this.toggleBlockType.bind(this);

    const decorator = new CompositeDecorator([
      {
        strategy: findLinkEntities,
        component: Link,
      },
    ]);

    if (props.defaultValue) {
      const blocksFromHTML = convertFromHTML(props.defaultValue);
      const state = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap,
      );

      this.state = {
        editorState: EditorState.createWithContent(state, decorator),
        showURLInput: false,
        value: props.defaultValue,
        urlValue: '',
      };
    } else {
      this.state = {
        editorState: EditorState.createEmpty(decorator),
        showURLInput: false,
        value: '',
        urlValue: '',
      };
    }

    this.focus = () => this[props.name].focus();
    this.onChange = editorState => this.setState({
      editorState,
      value: stateToHTML(editorState.getCurrentContent()),
    });

    this.promptForLink = this.promptForLink.bind(this);
    this.onURLChange = e => this.setState({ urlValue: e.target.value });
    this.confirmLink = this.confirmLink.bind(this);
    this.onLinkInputKeyDown = this.onLinkInputKeyDown.bind(this);
    this.removeLink = this.removeLink.bind(this);
  }

  onLinkInputKeyDown(e) {
    if (e.which === 13) {
      this.confirmLink(e);
    } else if (e.which === 27) {
      this.setState({ showURLInput: false });
    }
  }

  promptForLink(e) {
    e.preventDefault();
    const { editorState } = this.state;
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      const contentState = editorState.getCurrentContent();
      const startKey = editorState.getSelection().getStartKey();
      const startOffset = editorState.getSelection().getStartOffset();
      const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
      const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

      let url = '';
      if (linkKey) {
        const linkInstance = contentState.getEntity(linkKey);
        url = linkInstance.getData().url;
      }

      this.setState({
        showURLInput: true,
        urlValue: url,
      }, () => {
        setTimeout(() => this.url.focus(), 0);
      });
    }
  }

  confirmLink(e) {
    e.preventDefault();
    const { editorState, urlValue } = this.state;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      { url: urlValue },
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
    this.setState({
      editorState: RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey,
      ),
      showURLInput: false,
      urlValue: '',
    }, () => {
      setTimeout(() => this[this.props.name].focus(), 0);
    });
  }

  removeLink(e) {
    e.preventDefault();
    const { editorState } = this.state;
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      this.setState({
        editorState: RichUtils.toggleLink(editorState, selection, null),
      });
    }
  }

  toggleInlineStyle(style) {
    const { editorState } = this.state;
    this.onChange(RichUtils.toggleInlineStyle(editorState, style));
  }

  toggleBlockType(blockType) {
    const { editorState } = this.state;
    this.onChange(RichUtils.toggleBlockType(editorState, blockType));
  }

  render() {
    const { editorState, showURLInput, urlValue } = this.state;
    const { name, label, instructions, required } = this.props;

    let urlInput;
    if (showURLInput) {
      urlInput = (
        <div className="rich-text__url">
          <input
            onChange={this.onURLChange}
            ref={(r) => { this.url = r; }}
            className="rich-text__url__input input"
            type="text"
            placeholder="http://www.example.com"
            value={urlValue}
            onKeyDown={this.onLinkInputKeyDown}
          />
          <button className="rich-text__url__btn" type="button" onClick={this.confirmLink}>
            Confirm
          </button>
          <button className="rich-text__url__close" type="button" onClick={() => this.setState({ showURLInput: false })}>
            <Icon icon="cross" width={10} height={10} />
          </button>
        </div>
      );
    }

    const classes = classnames(
      'rich-text-wrapper',
      'form-element',
      { 'form-element--required': required },
    );

    return (
      <div className={classes}>
        {label && <label className="input__label" htmlFor={name}>{label}</label>}
        {instructions
          && <p className="input__instructions" dangerouslySetInnerHTML={{ __html: formatStringWithCode(instructions) }} /> // eslint-disable-line react/no-danger
        }
        <ToolBar
          editorState={editorState}
          toggleInlineStyle={this.toggleInlineStyle}
          toggleBlockType={this.toggleBlockType}
          removeLink={this.removeLink}
          promptForLink={this.promptForLink}
          urlInput={urlInput}
        />
        <div className="rich-text__editor" onClick={this.focus}>
          <Editor
            editorState={editorState}
            onChange={this.onChange}
            placeholder="Enter some text..."
            ref={(r) => { this[name] = r; }}
          />
        </div>
        <input type="text" readOnly required={required} hidden name={name} value={this.state.value} />
      </div>
    );
  }
}
