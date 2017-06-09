import { bool, number, string, shape, arrayOf, object } from 'prop-types';

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
      _id: string,
      title: string,
      instructions: string,
      type: string,
      dateCreated: number,
      slug: string,
      handle: string,
      required: bool,
    })),
  }),

  assets: shape({
    ...commonProps,
    assets: arrayOf(shape({
      _id: string,
      title: string,
      filename: string,
      dateCreated: number,
      size: number,
      width: number,
      height: number,
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

  pages: shape({
    ...commonProps,
    pages: arrayOf(shape({
      _id: string.isRequired,
      title: string.isRequired,
      slug: string.isRequired,
      handle: string.isRequired,
      dateCreated: number.isRequired,
      homepage: bool.isRequired,
      route: string.isRequired,
    })),
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
      height: string,
    }),
    style: string,
    debugMode: bool,
    scssEntryPoint: string,
    allowPublicRegistration: bool,
  }),

  user: shape({
    ...commonProps,
    _id: string,
    username: string,
    name: shape({
      first: string,
      last: string,
    }),
    dateCreated: number,
    image: string,
    email: string,
    usergroup: shape({
      _id: string,
      title: string,
      slug: string,
      dateCreated: number,
      permissions: object,
    }),
  }),

  users: shape({
    ...commonProps,
    users: arrayOf(shape({
      _id: string,
      username: string,
      name: shape({
        first: string,
        last: string,
      }),
      dateCreated: number,
      image: string,
    })),
  }),

  usergroups: shape({
    ...commonProps,
    usergroups: arrayOf(shape({
      _id: string,
      title: string,
      slug: string,
      dateCreated: number,
      permissions: object,
    })),
  }),
};

export default types;
