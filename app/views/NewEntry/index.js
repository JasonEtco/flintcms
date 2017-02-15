import React, { Component, PropTypes } from 'react';
import serialize from 'form-serialize';
import { newEntry } from '../../actions/entryActions';
import Page from '../../containers/Page';
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
    this.handleTitleChange = this.handleTitleChange.bind(this);
  }

  state = { title: '' };

  onSubmit(e) {
    e.preventDefault();
    const { sections, params } = this.props;
    const { title, ...rest } = serialize(this.form, { hash: true });
    const sectionId = h.getPropFromProp(sections.sections, { slug: params.section }, '_id');

    this.props.dispatch(newEntry(title, sectionId, rest));
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
      <Page name="new-entry" links={links}>
        <TitleBar title="New Entry">
          <Button onClick={this.onSubmit} small>Save</Button>
        </TitleBar>
        <div className="content">
          <div className="page__inner">
            <form onSubmit={this.onSubmit} ref={(r) => { this.form = r; }}>
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
            </form>
          </div>
        </div>
      </Page>
    );
  }
}
