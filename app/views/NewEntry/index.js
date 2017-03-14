import React, { Component, PropTypes } from 'react';
import serialize from 'form-serialize';
import { newEntry } from '../../actions/entryActions';
import Page from '../../containers/Page';
import Aside from '../../containers/Aside';
import TitleBar from '../../components/TitleBar';
import Input from '../../components/Input';
import Button from '../../components/Button';
import renderOption from '../../utils/renderOption';
import h from '../../utils/helpers';

export default class NewEntry extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    sections: PropTypes.object,
    fields: PropTypes.object,
    params: PropTypes.object.isRequired,
  }

  static defaultProps = {
    dispatch: null,
    sections: null,
    fields: null,
  }

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  state = { title: '', status: 'draft' };

  onSubmit(e) {
    e.preventDefault();
    const { sections, params } = this.props;
    const { title, status, ...fields } = serialize(this.page.form, { hash: true });
    const sectionId = h.getPropFromProp(sections.sections, { slug: params.section }, '_id');

    this.props.dispatch(newEntry(title, sectionId, status, fields));
  }

  renderFields(fieldId) {
    const { fields } = this.props.fields;
    const foundField = fields.find(f => f._id === fieldId);
    return renderOption(foundField);
  }

  render() {
    const { sections, params } = this.props;
    const { section } = params;
    const sectionObj = sections.sections.find(sec => sec.slug === section);
    const sectionName = h.getPropFromProp(sections.sections, { slug: section }, 'title');

    const links = [
      { label: sectionName, path: `/admin/entries/${section}` },
      { label: 'New Entry', path: `/admin/entries/${section}/new` },
    ];

    return (
      <Page name="new-entry" links={links} onSubmit={this.onSubmit} ref={(r) => { this.page = r; }}>
        <TitleBar title="New Entry">
          <Button onClick={this.onSubmit} small type="submit">Save</Button>
        </TitleBar>
        <div className="content">
          <div className="page__inner">
            <Input
              name="title"
              label="Title"
              ref={(r) => { this.title = r; }}
              required
              full
              onChange={title => this.setState({ title })}
            />

            <Input
              name="handle"
              label="Entry Handle"
              instructions="You can use this handle to reference this specific entry in a template."
              ref={(r) => { this.handle = r; }}
              required
              full
              code
              disabled
              value={h.slugify(this.state.title)}
            />

            {sectionObj.fields.map(fieldId => this.renderFields(fieldId))}
          </div>

          <Aside />
        </div>
      </Page>
    );
  }
}
