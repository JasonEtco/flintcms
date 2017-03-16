/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import Icon from '../../utils/icons';
import DayTile from './DayTile';
import Days from './Days';
import './DatePicker.scss';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function daysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

export default class DatePicker extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    label: PropTypes.string,
    instructions: PropTypes.string,
  }

  static defaultProps = {
    value: null,
    label: null,
    instructions: null,
  }

  constructor(props) {
    super(props);
    const { value } = props;
    const today = new Date().toLocaleString();
    this.value = today;

    this.state = {
      open: false,
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      value: value || today,
    };
  }

  componentDidMount() { window.addEventListener('click', this.hide); }
  componentWillUnmount() { window.removeEventListener('click', this.hide); }

  selectDate = ({ year, month, day }) => {
    const val = new Date(year, month, day);
    this.setState({ value: val.toLocaleString(), open: false });
  }

  incrementMonth = (e, forwards = true) => {
    e.stopPropagation();
    const { month, year } = this.state;
    if (forwards) {
      if (month === 11) {
        this.setState({ month: 0, year: year + 1 });
      } else {
        this.setState({ month: month + 1 });
      }
    } else if (month === 0) {
      this.setState({ month: 11, year: year - 1 });
    } else {
      this.setState({ month: month - 1 });
    }
  }

  hide = () => {
    this.setState({ open: false });
  }

  handleToggle = (e) => {
    e.stopPropagation();
    this.setState({ open: !this.state.open });
  }

  renderDates = () => {
    const { year, month, value } = this.state;

    const lastMonthDays = daysInMonth(month - 1, year);
    const thisMonthDays = daysInMonth(month, year);

    const offset = new Date(year, month).getDay();
    const dates = [];

    for (let i = 0; i < thisMonthDays + offset; i++) {
      if (i < offset) {
        dates.push(
          <DayTile
            key={i}
            day={(lastMonthDays - offset) + 1 + i}
            isActive={false}
            disabled
          />);
      } else {
        const day = (i - offset) + 1;
        dates.push(
          <DayTile
            key={i}
            day={day}
            isActive={new Date(value).getTime() === new Date(year, month, day).getTime()}
            onClick={() => this.selectDate({ year, month, day })}
          />);
      }
    }
    return dates;
  }

  render() {
    const { label, instructions, name } = this.props;
    const { month, year, value, open } = this.state;
    const inputVal = moment(new Date(value)).format('MM/DD/YYYY');

    return (
      <div className="datepicker-wrapper form-element">
        {label && <span className="input__label">{label}</span>}
        {instructions && <p className="input__instructions">{instructions}</p>}
        <div className="input-icon-wrapper">
          <input
            className="input"
            type="text"
            name={name}
            value={inputVal}
            onClick={this.handleToggle}
            ref={(r) => { this.input = r; }}
            readOnly
          />
          <button type="button" className="input__icon" onClick={this.handleToggle}>
            <Icon icon="calendar" />
          </button>
        </div>
        {open && <div className="datepicker" aria-expanded={open} onClick={e => e.stopPropagation()}>
          <div className="datepicker__controls">
            <button type="button" className="datepicker__controls__btn" onClick={e => this.incrementMonth(e, false)}>
              <Icon width={10} height={10} icon="arrowLeft" />
            </button>
            <span className="datepicker__month">{months[month]} {year}</span>
            <button type="button" className="datepicker__controls__btn" onClick={e => this.incrementMonth(e)}>
              <Icon width={10} height={10} icon="arrowRight" />
            </button>
          </div>

          {<Days />}

          <div className="datepicker__dates">
            {this.renderDates()}
          </div>
        </div>}
      </div>
    );
  }
}
