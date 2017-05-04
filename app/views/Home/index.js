import React, { Component } from 'react';
import { Link } from 'react-router';
import Page from '../../containers/Page';
import TitleBar from '../../components/TitleBar';
import { getSlugFromId } from '../../utils/helpers';
import t from '../../utils/types';
import './Home.scss';

export default class Home extends Component {
  static propTypes = {
    entries: t.entries,
    sections: t.sections,
  }

  static defaultProps = {
    entries: null,
    sections: null,
  }

  render() {
    const { entries } = this.props.entries;
    const { sections } = this.props.sections;

    if (!entries || !sections || sections.length === 0) {
      return (
        <Page name="home">
          <TitleBar title="Home" />

          <div className="content">
            <div className="page__inner">
              <h1>No content :(</h1>
            </div>
          </div>
        </Page>
      );
    }

    const newEntries = entries.slice(entries.length - 4, entries.length - 1);

    return (
      <Page name="home">
        <TitleBar title="Home" />

        <div className="content">
          <div className="page__inner">
            <div className="page--home__column">
              <h3 className="subtitle">Recent Entries</h3>
              <ul>
                {newEntries.map(e => <li key={e._id}><Link to={`/admin/entries/${getSlugFromId(sections, e.section)}/${e._id}`}>{e.title}</Link></li>)}
              </ul>
            </div>
          </div>
        </div>
      </Page>
    );
  }
}
