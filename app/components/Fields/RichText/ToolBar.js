import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ToolBarButton from './ToolBarButton';

export default class ToolBar extends Component {
  static propTypes = {
    toggleBlockType: PropTypes.func.isRequired,
    toggleInlineStyle: PropTypes.func.isRequired,
    promptForLink: PropTypes.func.isRequired,
    removeLink: PropTypes.func.isRequired,
    editorState: PropTypes.object.isRequired,
    urlInput: PropTypes.element,
  }

  static defaultProps = {
    urlInput: null,
  }

  constructor(props) {
    super(props);
    this.hide = this.hide.bind(this);
    this.toggleFormats = this.toggleFormats.bind(this);
  }

  state = { formatsIsVisible: false }

  componentDidMount() { window.addEventListener('click', this.hide); }
  componentWillUnmount() { window.removeEventListener('click', this.hide); }

  hide() {
    this.setState({ formatsIsVisible: false });
  }

  toggleFormats(e, style) {
    e.stopPropagation();
    this.setState({ formatsIsVisible: !this.state.formatsIsVisible });
    if (style !== undefined && style) this.props.toggleBlockType(style);
  }

  render() {
    const {
      toggleInlineStyle,
      removeLink,
      promptForLink,
      editorState,
      urlInput,
    } = this.props;

    const selection = editorState.getSelection();
    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();
    const currentStyle = editorState.getCurrentInlineStyle();

    const INLINE_BTNS = [
      { style: 'BOLD', title: 'Bold', icon: 'bold' },
      { style: 'ITALIC', title: 'Italic', icon: 'italic' },
      { style: 'UNDERLINE', title: 'Underline', icon: 'underline' },
      { style: 'CODE', title: 'Monospace', icon: 'embed' },
    ];

    const LINK_BTNS = [
      { style: 'LINK', title: 'Link', icon: 'link', onClick: promptForLink },
      { title: 'Remove Link', icon: 'breakLink', onClick: removeLink },
    ];

    const BLOCK_BTNS = [
        { title: 'H1', child: <h1>Heading 1</h1>, style: 'header-one' },
        { title: 'H2', child: <h2>Heading 2</h2>, style: 'header-two' },
        { title: 'H3', child: <h3>Heading 3</h3>, style: 'header-three' },
        { title: 'H4', child: <h4>Heading 4</h4>, style: 'header-four' },
        { title: 'H5', child: <h5>Heading 5</h5>, style: 'header-five' },
        { title: 'H6', child: <h6>Heading 6</h6>, style: 'header-six' },
        { title: 'Blockquote', child: <blockquote>Blockquote</blockquote>, style: 'blockquote' },
        { title: 'UL', child: <ul><li>Unordered List</li></ul>, style: 'unordered-list-item' },
        { title: 'OL', child: <ol><li>Ordered List</li></ol>, style: 'ordered-list-item' },
        { title: 'Code Block', child: <code>Code Block</code>, style: 'code-block' },
    ];

    return (
      <div className="rich-text__tools">
        <ToolBarButton
          title="Formats"
          icon="pilcrow"
          onClick={e => this.toggleFormats(e)}
        />
        <ul
          className="rich-text__tools__formats"
          style={{
            display: this.state.formatsIsVisible ? 'block' : 'none',
          }}
        >
          {BLOCK_BTNS.map(btn => (
            <li key={btn.title}>
              <button
                type="button"
                title={btn.title}
                onClick={e => this.toggleFormats(e, btn.style)}
              >{btn.child}</button>
            </li>))}
        </ul>

        <div className="rich-text__tools__sep" />

        {INLINE_BTNS.map(btn => (
          <ToolBarButton
            key={btn.title}
            active={currentStyle.has(btn.style)}
            title={btn.title}
            icon={btn.icon}
            style={btn.style}
            onClick={() => toggleInlineStyle(btn.style)}
          />))}

        <div className="rich-text__tools__sep" />

        {LINK_BTNS.map(btn => (
          <ToolBarButton
            key={btn.title}
            active={btn.style === blockType}
            title={btn.title}
            icon={btn.icon}
            onClick={btn.onClick}
          />))}

        {urlInput}
      </div>
    );
  }
}
