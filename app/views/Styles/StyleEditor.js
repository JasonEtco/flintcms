import React, { Component, PropTypes } from 'react';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/sass/sass';
import './CodeMirror.scss';

export default class StyleEditor extends Component {
  static propTypes = {
    file: PropTypes.string.isRequired,
  }

  state = { contents: null, isFetching: true }

  componentDidMount() {
    fetch(`/admin/api/styles?f=${this.props.file}`, { credentials: 'same-origin' })
      .then(res => res.json())
      .then((contents) => {
        this.setState({ contents, isFetching: false });
      });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.file !== this.props.file) {
      this.setState({ isFetching: true });

      fetch(`/admin/api/styles?f=${nextProps.file}`, { credentials: 'same-origin' })
        .then(res => res.json())
        .then((contents) => {
          this.setState({ contents, isFetching: false });
        });
    }
  }

  render() {
    const { isFetching, contents } = this.state;
    if (isFetching) return null;
    const options = {
      mode: 'sass',
      lineNumbers: true,
    };

    return (
      <div className="style-editor__editor">
        <CodeMirror value={contents} onChange={this.updateCode} options={options} />
      </div>
    );
  }
}
