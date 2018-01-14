/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Icon from 'utils/icons';
import DayTile from './DayTile';
import Days from './Days';
import './DatePicker.scss';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function daysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

function seperateDateObj(dateObj = new Date()) {
  return {
    month: dateObj.getMonth(),
    year: dateObj.getFullYear(),
    day: dateObj.getDate(),
    value: dateObj.toLocaleString(),
  };
}

export default class DatePicker extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.number,
    label: PropTypes.string,
    instructions: PropTypes.string,
    attachment: PropTypes.oneOf(['right', 'left']),
    disabled: PropTypes.bool,
  }

  static defaultProps = {
    value: Date.now(),
    label: null,
    instructions: null,
    attachment: 'left',
    disabled: false,
    onChange: f=>f
  }

  constructor(props) {
    super(props);
    const { value } = props;
    this.value = value;
    const { month, year } = seperateDateObj();

    this.selectDate = this.selectDate.bind(this);
    this.incrementMonth = this.incrementMonth.bind(this);
    this.hide = this.hide.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.isActive = this.isActive.bind(this);
    this.today = this.today.bind(this);
    this.renderDates = this.renderDates.bind(this);

    this.state = {
      open: false,
      month,
      year,
      value,
    };
  }

  componentDidMount() { window.addEventListener('click', this.hide); }
  componentWillUnmount() { window.removeEventListener('click', this.hide); }

  selectDate({ year, month, day }) {
    const value = new Date(year, month, day).getTime();
    this.props.onChange( moment(value).format('MM/DD/YYYY') );
    this.setState({ value, open: false });
  }

  incrementMonth(e, forwards = true) {
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

  hide() {
    this.setState({ open: false });
  }

  handleToggle(e) {
    if (this.props.disabled) return;

    e.stopPropagation();
    this.setState({ open: !this.state.open });
  }

  isActive(date) {
    const { year, month, day } = seperateDateObj(new Date(this.state.value));
    return year === date.year && month === date.month && day === date.day;
  }

  today() {
    const today = new Date();
    const { year, month, value } = seperateDateObj(today);
    this.setState({ value, month, year });
  }

  renderDates() {
    const { year, month } = this.state;

    const lastMonthDays = daysInMonth(month - 1, year);
    const thisMonthDays = daysInMonth(month, year);

    const { day: offset } = seperateDateObj(new Date(year, month));
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
            isActive={this.isActive({ year, month, day })}
            onClick={() => this.selectDate({ year, month, day })}
          />);
      }
    }
    return dates;
  }

  render() {
    const { label, instructions, name, attachment, disabled } = this.props;
    const { month, year, value, open } = this.state;
    const inputVal = moment(value).format('MM/DD/YYYY');

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
            disabled={disabled}
          />
          <button type="button" className="input__icon" onClick={this.handleToggle} disabled={disabled}>
            <Icon icon="calendar" />
          </button>
        </div>
        {open &&
        <div
          className="datepicker"
          aria-expanded={open}
          onClick={e => e.stopPropagation()}
          style={attachment === 'left' ? { left: 0 } : { right: 0 }}
        >
          <div className="datepicker__inner">
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
            <button className="datepicker__today" type="button" onClick={this.today}>Today</button>
          </div>
        </div>}

      </div>
    );
  }
}
