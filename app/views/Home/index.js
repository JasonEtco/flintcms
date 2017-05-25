import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Page from 'containers/Page';
import TitleBar from 'components/TitleBar';
import { getSlugFromId, formatDate } from 'utils/helpers';
import t from 'utils/types';
import './Home.scss';

export default class Home extends Component {
  static propTypes = {
    entries: t.entries.isRequired,
    sections: t.sections.isRequired,
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

    const newEntries = entries.slice(entries.length - 4).reverse();

    return (
      <Page name="home">
        <TitleBar title="Home" />

        <div className="content">
          <div className="page__inner">
            <div className="home__column">
              <h3 className="subtitle">Recent Entries</h3>
              <ul className="home__list">
                {newEntries.map(e =>
                  <li key={e._id} className="home__list-item">
                    <Link to={`/entries/${getSlugFromId(sections, e.section)}/${e._id}`}>
                      <h4>{e.title}</h4>
                      <div className="home__list-item__meta">
                        <span className="home__list-item__author">{e.author.username}</span>
                        <span className="home__list-item__date">{formatDate(e.dateCreated)}</span>
                      </div>
                    </Link>
                  </li>)}
              </ul>
            </div>
          </div>
        </div>
      </Page>
    );
  }
}
