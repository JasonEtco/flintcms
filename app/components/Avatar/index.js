import React from 'react'
import { shape, string } from 'prop-types'
import defaultImage from 'assets/default_user.png'

export default function Avatar ({ user }) {
  if (user.image) return <img src={`/public/assets/${user.image}`} alt={user.username} />
  return <img src={defaultImage} alt={user.username} />
}

Avatar.propTypes = {
  user: shape({
    username: string.isRequired,
    image: string
  }).isRequired
}
