import React, { Component, PropTypes } from 'react';
import h from '../../utils/helpers';
import FieldSource from './FieldSource';
import FieldTarget from './FieldTarget';
import './FieldLayout.scss';


export default class FieldLayout extends Component {
  static propTypes = {
    fields: PropTypes.array.isRequired,
    activeFields: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);

    this.addField = this.addField.bind(this);
    this.removeField = this.removeField.bind(this);
    this.sortField = this.sortField.bind(this);

    this.state = { fields: props.activeFields };
  }

  addField(field, index) {
    const { fields } = this.state;
    this.setState({ fields: h.addToArrayAtIndex(fields, field, index) });
  }

  removeField(fieldId) {
    const { fields } = this.state;
    const fieldIndex = fields.findIndex(obj => obj._id === fieldId);
    this.setState({
      fields: [
        ...fields.slice(0, fieldIndex),
        ...fields.slice(fieldIndex + 1),
      ],
    });
  }

  sortField(index, newIndex) {
    const { fields } = this.state;
    const moved = h.arrayMove(fields, index, newIndex);

    this.setState({
      fields: moved,
    });
  }

  render() {
    const { fields } = this.props;

    return (
      <section className="field-layout">
        <h3 className="field-layout__title">Field Layout</h3>

        <FieldTarget
          fields={this.state.fields}
          addField={this.addField}
          removeField={this.removeField}
          sortField={this.sortField}
        />

        <div className="field-layout__fields">
          {fields.map((field, i) =>
            <FieldSource
              key={field._id}
              index={i}
              field={field}
              disabled={this.state.fields.findIndex(obj => obj._id === field._id) !== -1}
              new
            />)}
        </div>
      </section>
    );
  }
}
