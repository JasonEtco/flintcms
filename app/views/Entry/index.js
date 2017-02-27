import React, { Component, PropTypes } from 'react';
import types from '../../utils/types';
import h from '../../utils/helpers';
import renderOption from '../../utils/renderOption';
import Page from '../../containers/Page';
import TitleBar from '../../components/TitleBar';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { deleteEntry } from '../../actions/entryActions';

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
    this.renderFields = this.renderFields.bind(this);
    this.deleteEntry = this.deleteEntry.bind(this);
    this.entry = entries.entries.find(e => e._id === id);
  }

  deleteEntry() {
    this.props.dispatch(deleteEntry(this.entry._id));
  }

  renderFields(field) {
    const foundField = this.props.fields.fields.find(f => f._id === field.fieldId);
    return renderOption(foundField, field.value);
  }

  render() {
    const { section, title, _id, fields } = this.entry;
    const { sections } = this.props;
    const sectionSlug = h.getSlugFromId(sections.sections, section);
    const sectionName = h.getPropFromProp(sections.sections, { _id: section }, 'title');

    const links = [
      { label: 'Entries', path: '/admin/entries' },
      { label: sectionName, path: `/admin/entries/${sectionSlug}` },
      { label: title, path: `/admin/entries/${sectionSlug}/${_id}` },
    ];

    return (
      <Page name="entry" links={links}>
        <TitleBar title={title}>
          <Button>Save Entry</Button>
          <Button onClick={this.deleteEntry}>Delete Entry</Button>
        </TitleBar>
        <div className="content">
          <div className="page__inner">
            <Input label="Title" defaultValue={title} name={title} full required />
            {fields.map(field => this.renderFields(field))}
          </div>
        </div>
      </Page>
    );
  }
}
