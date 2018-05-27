import { bool, number, string, shape, arrayOf, oneOf, oneOfType } from 'prop-types'
import p from '../../server/utils/permissions.json'

// Reduces the master permissions object
// into an format easily consumable by `prop-types`
const permissions = Object.keys(p)
  .reduce((prev, curr) => ({
    ...prev,
    [curr]: shape(p[curr].reduce((previ, c) => ({
      ...previ,
      [c.name]: bool.isRequired
    }), {})).isRequired
  }), {})

const commonProps = {
  isFetching: bool.isRequired,
  didInvalidate: bool,
  lastUpdated: number
}

const types = {
  entries: shape({
    ...commonProps,
    entries: arrayOf(shape({
      _id: string.isRequired,
      title: string.isRequired,
      slug: string.isRequired,
      status: oneOf(['live', 'draft', 'disabled']).isRequired,
      dateCreated: number.isRequired
    })).isRequired
  }),

  fields: shape({
    ...commonProps,
    fields: arrayOf(shape({
      _id: string.isRequired,
      title: string.isRequired,
      instructions: string,
      type: string.isRequired,
      dateCreated: number.isRequired,
      slug: string.isRequired,
      handle: string.isRequired,
      required: bool
    })).isRequired
  }),

  assets: shape({
    ...commonProps,
    assets: arrayOf(shape({
      _id: string.isRequired,
      title: string.isRequired,
      filename: string.isRequired,
      dateCreated: number.isRequired,
      size: number.isRequired,
      width: number.isRequired,
      height: number.isRequired
    })).isRequired
  }),

  sections: shape({
    ...commonProps,
    sections: arrayOf(shape({
      _id: string.isRequired,
      title: string.isRequired,
      slug: string.isRequired,
      dateCreated: number.isRequired
    })).isRequired
  }),

  pages: shape({
    ...commonProps,
    pages: arrayOf(shape({
      _id: string.isRequired,
      title: string.isRequired,
      slug: string.isRequired,
      handle: string.isRequired,
      dateCreated: number.isRequired,
      homepage: bool.isRequired,
      route: string.isRequired
    })).isRequired
  }),

  site: shape({
    ...commonProps,
    defaultUserGroup: string,
    siteUrl: string,
    siteName: string,
    siteLogo: shape({
      _id: string,
      title: string,
      filename: string,
      dateCreated: string,
      size: string,
      width: string,
      height: string
    }),
    style: string,
    debugMode: bool,
    scssEntryPoint: oneOfType([string, bool]),
    allowPublicRegistration: bool
  }),

  user: shape({
    ...commonProps,
    _id: string,
    username: string,
    name: shape({
      first: string,
      last: string
    }),
    dateCreated: number,
    image: string,
    email: string,
    usergroup: shape({
      _id: string,
      title: string,
      slug: string,
      dateCreated: number,
      permissions: shape(permissions)
    })
  }),

  users: shape({
    ...commonProps,
    users: arrayOf(shape({
      _id: string.isRequired,
      username: string.isRequired,
      name: shape({
        first: string,
        last: string
      }),
      dateCreated: number.isRequired,
      image: string
    })).isRequired
  }),

  usergroups: shape({
    ...commonProps,
    usergroups: arrayOf(shape({
      _id: string.isRequired,
      title: string.isRequired,
      slug: string.isRequired,
      dateCreated: number.isRequired,
      permissions: shape(permissions).isRequired
    }))
  }),

  plugins: shape({
    ...commonProps,
    plugins: arrayOf(shape({
      _id: string.isRequired
    })).isRequired
  })
}

export default types
