import React, { Component, PropTypes } from 'react';
import serialize from 'form-serialize';
import types from '../../utils/types';
import h from '../../utils/helpers';
import renderOption from '../../utils/renderOption';
import Page from '../../containers/Page';
import TitleBar from '../../components/TitleBar';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { deleteEntry, updateEntry } from '../../actions/entryActions';

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
    this.onSubmit = this.onSubmit.bind(this);
    this.entry = entries.entries.find(e => e._id === id);
  }

  onSubmit(e) {
    e.preventDefault();
    const data = serialize(this.page.form, { hash: true });
    this.props.dispatch(updateEntry(this.entry._id, data));
  }

  deleteEntry() {
    this.props.dispatch(deleteEntry(this.entry._id));
  }

  renderFields(field) {
    const foundField = this.props.fields.fields.find(f => f._id === field.fieldId);
    return renderOption(foundField, field.value);
  }

  render() {
    const { sections, entries, params } = this.props;
    const { section, title, _id, fields } = entries.entries.find(e => e._id === params.id);
    const sectionSlug = h.getSlugFromId(sections.sections, section);
    const sectionName = h.getPropFromProp(sections.sections, { _id: section }, 'title');

    const links = [
      { label: 'Entries', path: '/admin/entries' },
      { label: sectionName, path: `/admin/entries/${sectionSlug}` },
      { label: title, path: `/admin/entries/${sectionSlug}/${_id}` },
    ];

    return (
      <Page name="entry" links={links} onSubmit={this.onSubmit} ref={(r) => { this.page = r; }}>
        <TitleBar title={title}>
          <Button small onClick={this.Submit} type="submit">Save Entry</Button>
          <Button small onClick={this.deleteEntry}>Delete Entry</Button>
        </TitleBar>
        <div className="content">
          <div className="page__inner">
            <Input label="Title" defaultValue={title} name="title" full required />
            {fields.map(field => this.renderFields(field))}
          </div>
        </div>
      </Page>
    );
  }
}
