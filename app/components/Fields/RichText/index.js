/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { Component, PropTypes } from 'react';
import {
  CompositeDecorator,
  Editor,
  EditorState,
  RichUtils,
} from 'draft-js';
import ToolBar from './ToolBar';
import Icon from '../../../utils/icons';
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

const styles = {
  urlInputContainer: {
    marginBottom: 10,
  },
  urlInput: {
    fontFamily: '\'Georgia\', serif',
    marginRight: 10,
    padding: 3,
  },
  link: {
    color: '#3b5998',
    textDecoration: 'underline',
  },
};

const Link = (props) => {
  const { url } = props.contentState.getEntity(props.entityKey).getData();
  return (
    <a href={url} style={styles.link}>
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
  }

  static defaultProps = {
    instructions: null,
    defaultValue: null,
  }

  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
    this.onChange = editorState => this.setState({ editorState });

    this.toggleInlineStyle = this.toggleInlineStyle.bind(this);
    this.toggleBlockType = this.toggleBlockType.bind(this);

    const decorator = new CompositeDecorator([
      {
        strategy: findLinkEntities,
        component: Link,
      },
    ]);

    this.state = {
      editorState: EditorState.createEmpty(decorator),
      showURLInput: false,
      urlValue: '',
    };

    this.focus = () => this.editor.focus();
    this.onChange = editorState => this.setState({ editorState });

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
      setTimeout(() => this.editor.focus(), 0);
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

    return (
      <div className="rich-text-wrapper form-element">
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
            ref={(r) => { this.editor = r; }}
          />
        </div>
      </div>
    );
  }
}
