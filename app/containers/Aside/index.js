import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StatusDot from 'components/StatusDot';
import Dropdown, { DropdownChild } from 'components/Fields/Dropdown';
import DatePicker from 'components/DatePicker';
import './Aside.scss';

export default class Aside extends Component {
  static propTypes = {
    noStatus: PropTypes.bool,
    status: PropTypes.oneOf(['live', 'draft', 'disabled']),
    dateCreated: PropTypes.number,
    children: PropTypes.any,
    disabled: PropTypes.bool,
  }

  static defaultProps = {
    noStatus: false,
    status: 'draft',
    dateCreated: undefined,
    children: null,
    disabled: false,
  }

  constructor(props) {
    super(props);
    this.state = { status: props.status };
  }

  componentWillReceiveProps(newProps) {
    this.setState({ status: newProps.status });
  }

  render() {
    const { status } = this.state;
    const { dateCreated, children, noStatus, disabled } = this.props;

    return (
      <aside className="aside">
        {!noStatus && <Dropdown
          disabled={disabled}
          name="status"
          label="Status"
          full
          defaultValue={status}
          onChange={s => this.setState({ status: s })}
          options={[
            { label: 'Live', component: <DropdownChild>Live<StatusDot status="live" /></DropdownChild>, value: 'live' },
            { label: 'Draft', component: <DropdownChild>Draft<StatusDot status="draft" /></DropdownChild>, value: 'draft' },
            { label: 'Disabled', component: <DropdownChild>Disabled<StatusDot status="disabled" /></DropdownChild>, value: 'disabled' },
          ]}
        >
          <StatusDot status={this.state.status} />
        </Dropdown>}

        <DatePicker disabled={disabled} attachment="right" name="dateCreated" label="Date Created" value={dateCreated} />

        {children}
      </aside>
    );
  }
}
