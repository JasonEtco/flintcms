import React, { Component, PropTypes } from 'react';
import FieldSource from './FieldSource';
import FieldTarget from './FieldTarget';
import './FieldLayout.scss';


export default class FieldLayout extends Component {
  static propTypes = {
    fields: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);

    this.addField = this.addField.bind(this);
    this.removeField = this.removeField.bind(this);
  }

  state = { fields: [] }

  addField(fieldId) {
    this.setState({ fields: [...this.state.fields, fieldId] });
  }

  removeField(fieldId) {
    const { fields } = this.state;
    const fieldIndex = fields.indexOf(fieldId);
    this.setState({
      fields: [
        ...fields.slice(0, fieldIndex),
        ...fields.slice(fieldIndex + 1),
      ],
    });
  }

  render() {
    const { fields } = this.props;
    const activeFields = fields.filter(field => this.state.fields.indexOf(field._id) !== -1);

    return (
      <section className="field-layout">
        <h3 className="field-layout__title">Field Layout</h3>

        <FieldTarget fields={activeFields} addField={this.addField} removeField={this.removeField} />

        <div className="field-layout__fields">
          {fields.map(field =>
            <FieldSource
              key={field._id}
              field={field}
              disabled={this.state.fields.indexOf(field._id) !== -1}
            />)}
        </div>
      </section>
    );
  }
}
