import React, { Component, PropTypes } from 'react';
import types from '../../utils/types';
import h from '../../utils/helpers';
import Page from '../../containers/Page';
import TitleBar from '../../components/TitleBar';
import Button from '../../components/Button';
import Input from '../../components/Input';

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
    const sectionName = h.getPropFromProp(sections.sections, { _id: section }, 'title');

    const links = [
      { label: sectionName, path: `/admin/entries/${sectionSlug}` },
      { label: 'Entry', path: `/admin/entries/${sectionSlug}/${_id}` },
    ];

    return (
      <Page name="entry" links={links}>
        <TitleBar title={title}>
          <Button>Save Entry</Button>
        </TitleBar>
        <div className="content">
          <div className="page__inner">
            <Input defaultValue={title} name={title} />
          </div>
        </div>
      </Page>
    );
  }
}
