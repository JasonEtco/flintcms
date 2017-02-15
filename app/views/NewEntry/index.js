import React, { Component, PropTypes } from 'react';
import { newEntry } from '../../actions/entryActions';
import Button from '../../components/Button';
import renderOption from '../../utils/renderOption';

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

  onSubmit(e) {
    e.preventDefault();
    this.props.dispatch(newEntry(this.title.value, this.section.value));
  }

  render() {
    const { sections, fields, params } = this.props;
    const sectionObj = sections.sections.find(sec => sec.slug === params.section);
    const sectionFields = fields.fields
      .filter(field => sectionObj.fields.indexOf(field._id) !== -1);

    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <input type="text" name="title" ref={(r) => { this.title = r; }} />
          {sectionFields.map(field => renderOption(field))}
          <Button type="submit">Add Entry</Button>
        </form>
      </div>
    );
  }
}
