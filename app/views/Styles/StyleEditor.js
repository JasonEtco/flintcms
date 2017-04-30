import React, { Component, PropTypes } from 'react';
import { get } from 'axios';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/sass/sass';
import './CodeMirror.scss';

export default class StyleEditor extends Component {
  static propTypes = {
    file: PropTypes.string.isRequired,
    canSave: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.updateCode = this.updateCode.bind(this);
  }

  state = { contents: null, isFetching: true }

  componentDidMount() {
    get(`/admin/api/styles?f=${this.props.file}`)
      .then(({ data }) => {
        this.setState({ originalContents: data, contents: data, isFetching: false });
      });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.file !== this.props.file) {
      this.setState({ isFetching: true });

      get(`/admin/api/styles?f=${nextProps.file}`)
        .then(({ data }) => {
          this.setState({ contents: data, isFetching: false });
        });
    }
  }

  updateCode(contents) {
    if (contents !== this.state.originalContents) {
      this.props.canSave(true);
    } else {
      this.props.canSave(false);
    }

    this.setState({ contents });
  }

  render() {
    const { isFetching, contents } = this.state;
    if (isFetching && !contents) return null;

    const options = {
      mode: 'sass',
      lineNumbers: true,
      indentUnit: 4,
      indentWithTabs: true,
    };

    return (
      <div className="style-editor__editor">
        <CodeMirror value={contents} onChange={this.updateCode} options={options} />
      </div>
    );
  }
}
