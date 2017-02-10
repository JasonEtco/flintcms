import React, { Component, PropTypes } from 'react';
import types from '../../utils/types';
import h from '../../utils/helpers';
import Page from '../../containers/Page';
import Breadcrumbs from '../../components/Breadcrumbs';

export default class Entry extends Component {
  static propTypes = {
    ...types.entries,
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }

  static defaultProps = {
    title: '',
  }

  constructor(props) {
    super(props);

    const { entries, params } = props;
    const { id } = params;
    this.entry = entries.entries.find(e => e._id === id);
  }

  render() {
    const { section, title, _id } = this.entry;
    const { sections } = this.props;
    const sectionSlug = h.getSlugFromId(sections.sections, section);

    const links = [
      { label: sectionSlug, path: `/admin/entries/${sectionSlug}` },
      { label: 'Entry', path: `/admin/entries/${sectionSlug}/${_id}` },
    ];

    return (
      <Page name="entry">
        <Breadcrumbs links={links} />
        <input type="text" defaultValue={title} />
      </Page>
    );
  }
}
