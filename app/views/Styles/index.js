import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Page from '../../containers/Page';
import TitleBar from '../../components/TitleBar';
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

  state = { isFetching: true }

  componentDidMount() {
    fetch('/admin/api/styles', { credentials: 'same-origin' })
      .then(res => res.json())
      .then((files) => {
        this.setState({ files, isFetching: false });
      });
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
    const { files, isFetching } = this.state;
    if (isFetching) return null;

    const red = (arr, str) => {
      const reducer = (prev, curr) => {
        if (curr.children) return { ...prev, [curr.name]: red(curr.children, str ? `${str}/${curr.name}` : curr.name) };
        return { ...prev, [curr.name]: str ? `${str}/${curr.name}` : curr.name };
      };
      return arr.reduce(reducer, {});
    };
    const fileLinks = red(files.children);
    const { file } = this.props.location.query;

    return (
      <Page name="styles">
        <TitleBar title={file || 'Styles'} />
        <div className="content">
          <ul>
            {this.renderTree(fileLinks)}
          </ul>
          <div className="page__inner">
            {file && <StyleEditor file={file} />}
          </div>
        </div>
      </Page>
    );
  }
}
