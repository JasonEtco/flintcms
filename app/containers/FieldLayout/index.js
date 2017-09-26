import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import FieldSource from './FieldSource';
import FieldTarget from './FieldTarget';
import './FieldLayout.scss';

class FieldLayout extends Component {
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

  addField(field) {
    const { fields } = this.state;
    const newFields = [...fields, field];
    this.setState({ fields: newFields });
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

  sortField(dragIndex, hoverIndex) {
    const { fields } = this.state;
    const dragField = fields[dragIndex];

    this.setState(update(this.state, {
      fields: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragField],
        ],
      },
    }));
  }

  render() {
    const { fields } = this.props;

    return (
      <section className="field-layout">
        <h3 className="field-layout__title">Field Layout</h3>

        <div className="field-layout__inner">
          <FieldTarget
            fields={this.state.fields}
            addField={this.addField}
            removeField={this.removeField}
            sortField={this.sortField}
          />

          <div className="field-layout__fields">
            {fields.map((field, i) => (
              <FieldSource
                key={field._id}
                index={i}
                field={field}
                disabled={this.state.fields.findIndex(obj => obj._id === field._id) !== -1}
                isNew
              />))}
          </div>
        </div>
      </section>
    );
  }
}

export default DragDropContext(HTML5Backend)(FieldLayout);
