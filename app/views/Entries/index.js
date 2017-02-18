import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import moment from 'moment';
import types from '../../utils/types';
import h from '../../utils/helpers';
import Page from '../../containers/Page';
import TitleBar from '../../components/TitleBar';
import SecondaryNav from '../../components/SecondaryNav';
import Table from '../../components/Table';

export default class Entries extends Component {
  static propTypes = {
    ...types.entries,
    ...types.sections,
  }

  componentWillMount() {
    const { section } = this.props.params;
    const { sections } = this.props.sections;
    const ref = localStorage.getItem('lastSection');

    if (section) {
      localStorage.setItem('lastSection', section);
    } else if (ref) {
      const refExists = sections.some(obj => obj.slug === ref);
      if (refExists) {
        browserHistory.push(`/admin/entries/${ref}`);
      } else {
        localStorage.removeItem('lastSection');
      }
    }
  }

  render() {
    const { users, params } = this.props;
    const { entries } = this.props.entries;
    const { sections } = this.props.sections;

    const { section } = params;
    const filtered = section === undefined
      ? entries
      : entries.filter(e => e.section === h.getIdFromSlug(sections, section));
    const navLinks = sections.map(sec => ({ label: sec.title, path: `/admin/entries/${sec.slug}` }));

    const reduced = filtered.map(props => ({
      title: {
        value: props.title,
        component: <Link to={`/admin/entries/${h.getSlugFromId(sections, props.section)}/${props._id}`}>{props.title}</Link>,
      },
      slug: props.slug,
      dateCreated: moment(props.dateCreated).format('DD/MM/YYYY'),
      author: h.getPropFromProp(users.users, { _id: props.author }, 'username'),
    }));

    return (
      <Page name="entries">
        <TitleBar title="Entries">
          {!!section && <Link to={`/admin/entries/${section}/new`} className="btn btn--small">New Entry</Link>}
        </TitleBar>

        <div className="content">
          <SecondaryNav links={navLinks}>
            <Link to="/admin/entries" activeClassName="is-active" onClick={() => localStorage.removeItem('lastSection')}>All</Link>
          </SecondaryNav>

          <div className="page__inner">
            {filtered.length > 0 ? <Table data={reduced} /> : <h3>No entries!</h3>}
          </div>
        </div>
      </Page>
    );
  }
}
