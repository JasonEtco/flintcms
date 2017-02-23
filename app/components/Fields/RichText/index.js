/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { Component, PropTypes } from 'react';
import {
  CompositeDecorator,
  Editor,
  EditorState,
  RichUtils,
} from 'draft-js';
import ToolBarButton from './ToolBarButton';
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

    this.bold = this.bold.bind(this);

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

  bold() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  italic() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
  }

  render() {
    let urlInput;
    if (this.state.showURLInput) {
      urlInput = (
        <div style={styles.urlInputContainer}>
          <input
            onChange={this.onURLChange}
            ref={(r) => { this.url = r; }}
            style={styles.urlInput}
            type="text"
            value={this.state.urlValue}
            onKeyDown={this.onLinkInputKeyDown}
          />
          <button type="button" onMouseDown={this.confirmLink}>
            Confirm
          </button>
        </div>
      );
    }

    return (
      <div className="rich-text-wrapper form-element">
        <div className="rich-text__tools">
          <ToolBarButton title="Bold" icon="bold" onClick={() => this.bold()} />
          <ToolBarButton title="Italic" icon="italic" onClick={() => this.italic()} />
          <ToolBarButton title="Link" icon="link" onClick={this.promptForLink} />
          <ToolBarButton title="Remove Link" icon="cross" onClick={this.removeLink} />
        </div>
        <div className="rich-text__editor" onClick={this.focus}>
          {urlInput}
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            placeholder="Enter some text..."
            ref={(r) => { this.editor = r; }}
          />
        </div>
      </div>
    );
  }
}
