import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Page from '../../containers/Page';
import TitleBar from '../../components/TitleBar';
import h from '../../utils/helpers';
import './Home.scss';

export default class Home extends Component {
  static propTypes = {
    entries: PropTypes.object.isRequired,
    sections: PropTypes.object.isRequired,
  };

  render() {
    const { entries } = this.props.entries;
    const { sections } = this.props.sections;
    const newEntries = [...entries].reverse().slice(0, 3);

    return (
      <Page name="home">
        <TitleBar title="Home" />

        <div className="content">
          <div className="page__inner">
            <div className="page--home__column">
              <h3 className="subtitle">Recent Entries</h3>
              <ul>
                {newEntries.map(e =>
                  <li key={e._id}><Link to={`/admin/entries/${h.getSlugFromId(sections, e.section)}/${e._id}`}>{e.title}</Link></li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </Page>
    );
  }
}
