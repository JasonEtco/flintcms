import React from 'react'

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const Days = () => (
  <div className='datepicker__days'>
    {days.map(day => <span key={day} className='datepicker__day'>{day}</span>)}
  </div>)

export default Days
