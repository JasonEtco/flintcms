import React, { Component, PropTypes } from 'react';
import { get, post } from 'axios';
import { Link } from 'react-router';
import Page from '../../containers/Page';
import TitleBar from '../../components/TitleBar';
import Button from '../../components/Button';
import StyleEditor from './StyleEditor';
import './Styles.scss';

export default class Styles extends Component {
  static propTypes = {
    location: PropTypes.shape({
      query: PropTypes.shape({
        file: PropTypes.string,
      }),
    }),
  }

  static defaultProps = {
    location: null,
  }

  constructor(props) {
    super(props);
    this.canSave = this.canSave.bind(this);
    this.saveFile = this.saveFile.bind(this);
  }

  state = { isFetching: true, canSave: false }

  componentDidMount() {
    get('/admin/api/styles')
      .then(({ data }) => {
        this.setState({ files: data, isFetching: false });
      });
  }

  canSave(canSave) {
    this.setState({ canSave });
  }

  saveFile(e) {
    e.preventDefault();
    const { file } = this.props.location.query;

    post('/admin/api/styles', {
      file,
      contents: this.editor.state.contents,
    })
    .then((res) => {
      console.log(res);
    });
  }

  recursiveReducer(arr, str) {
    const reducer = (prev, curr) => {
      if (curr.children) return { ...prev, [curr.name]: this.recursiveReducer(curr.children, str ? `${str}/${curr.name}` : curr.name) };
      return { ...prev, [curr.name]: str ? `${str}/${curr.name}` : curr.name };
    };
    return arr.reduce(reducer, {});
  }

  renderTree(obj) {
    const arr = Object.keys(obj);
    const mapper = (file) => {
      if (typeof obj[file] === 'object') {
        return (
          <li key={file}>
            <ul data-dir={file}>
              {file}
              {this.renderTree(obj[file])}
            </ul>
          </li>
        );
      }
      return <li key={file}><Link to={`/admin/settings/styles?file=${obj[file]}`}>{file}</Link></li>;
    };
    return arr.map(mapper);
  }

  render() {
    const { files, isFetching, canSave } = this.state;
    if (isFetching) return null;

    const fileLinks = this.recursiveReducer(files.children);
    const { file } = this.props.location.query;

    return (
      <Page name="styles" onSubmit={file ? this.saveFile : undefined}>
        <TitleBar title={file || 'Styles'}>
          <Button small type="submit" disabled={!canSave}>Save changes</Button>
        </TitleBar>
        <div className="content">
          <ul>
            {this.renderTree(fileLinks)}
          </ul>
          <div className="page__inner">
            {file
              ? <StyleEditor file={file} canSave={this.canSave} ref={(r) => { this.editor = r; }} />
              : <p>This editor is not intended to be a fully-fledged way of managing your site&apos;s styles; use it to make small changes only.</p>}
          </div>
        </div>
      </Page>
    );
  }
}
