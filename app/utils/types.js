import { PropTypes } from 'react';

const { bool, number, string, shape, arrayOf, object } = PropTypes;

const commonProps = {
  isFetching: bool,
  didInvalidate: bool,
  lastUpdated: number,
};

const types = {
  entries: shape({
    ...commonProps,
    entries: arrayOf(shape({
      _id: string,
      title: string,
      slug: string,
      dateCreated: number,
      body: string,
    })),
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
      required: bool.isRequired,
    })),
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
      height: number.isRequired,
    })),
  }),

  sections: shape({
    ...commonProps,
    sections: arrayOf(shape({
      _id: string,
      title: string,
      slug: string,
      dateCreated: number,
    })),
  }),

  site: shape({
    ...commonProps,
    defaultUserGroup: string,
    siteUrl: string,
    siteName: string,
    siteLogo: shape({
      _id: string.isRequired,
      title: string.isRequired,
      filename: string.isRequired,
      dateCreated: string.isRequired,
      size: string.isRequired,
      width: string.isRequired,
      height: string.isRequired,
    }),
    style: string,
    debugMode: bool,
    scssEntryPoint: string,
  }),

  user: shape({
    ...commonProps,
    _id: string.isRequired,
    username: string.isRequired,
    name: shape({
      first: string,
      last: string,
    }),
    dateCreated: number,
    image: string.isRequired,
    email: string.isRequired,
  }),

  users: shape({
    ...commonProps,
    users: arrayOf(shape({
      _id: string.isRequired,
      username: string.isRequired,
      name: shape({
        first: string,
        last: string,
      }),
      dateCreated: number,
      image: string.isRequired,
    })),
  }),

  usergroups: shape({
    ...commonProps,
    usergroups: arrayOf(shape({
      _id: string.isRequired,
      title: string.isRequired,
      slug: string.isRequired,
      dateCreated: number.isRequired,
      permissions: object,
    })),
  }),
};

export default types;
