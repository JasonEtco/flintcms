import React, { PropTypes } from 'react';
import { capitalize } from '../../utils/helpers';
import './StatusDot.scss';

const StatusDot = ({ status }) => <div title={capitalize(status)} className={`status status--${status}`} />;

StatusDot.propTypes = { status: PropTypes.oneOf(['live', 'draft', 'disabled']) };
StatusDot.defaultProps = { status: 'disabled' };

export default StatusDot;
