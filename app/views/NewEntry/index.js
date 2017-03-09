import React, { Component, PropTypes } from 'react';
import serialize from 'form-serialize';
import { newEntry } from '../../actions/entryActions';
import Page from '../../containers/Page';
import Aside from '../../containers/Aside';
import TitleBar from '../../components/TitleBar';
import Input from '../../components/Input';
import StatusDot from '../../components/StatusDot';
import Dropdown, { DropdownChild } from '../../components/Fields/Dropdown';
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
    this.handleTitleChange = this.handleTitleChange.bind(this);
  }

  state = { title: '' };

  onSubmit(e) {
    e.preventDefault();
    const { sections, params } = this.props;
    const { title, ...fields } = serialize(this.page.form, { hash: true });
    const sectionId = h.getPropFromProp(sections.sections, { slug: params.section }, '_id');

    this.props.dispatch(newEntry(title, sectionId, fields));
  }

  handleTitleChange(title) {
    this.setState({ title });
  }

  render() {
    const { sections, fields, params } = this.props;
    const { section } = params;
    const sectionObj = sections.sections.find(sec => sec.slug === section);
    const sectionFields = fields.fields
      .filter(field => sectionObj.fields.indexOf(field._id) !== -1);

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
              onChange={this.handleTitleChange}
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

            {sectionFields.map(field => renderOption(field))}
          </div>

          <Aside>
            <Dropdown
              ref={(r) => { this.status = r; }}
              name="status"
              label="Status"
              full
              defaultValue="draft"
              options={[
                { label: 'Live', component: <DropdownChild>Live<StatusDot status="live" /></DropdownChild>, value: 'live' },
                { label: 'Draft', component: <DropdownChild>Draft<StatusDot status="draft" /></DropdownChild>, value: 'draft' },
                { label: 'Disabled', component: <DropdownChild>Disabled<StatusDot status="disabled" /></DropdownChild>, value: 'disabled' },
              ]}
            />
          </Aside>
        </div>
      </Page>
    );
  }
}
