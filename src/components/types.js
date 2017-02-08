import { PropTypes } from 'react';

const types = {
  entries: PropTypes.shape({
    isFetching: PropTypes.bool,
    didInvalidate: PropTypes.bool,
    entries: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string,
      title: PropTypes.string,
      slug: PropTypes.string,
      dateCreated: PropTypes.string,
      body: PropTypes.string,
    })),
    lastUpdated: PropTypes.number,
  }).isRequired,
  sections: PropTypes.shape({
    isFetching: PropTypes.bool,
    didInvalidate: PropTypes.bool,
    sections: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string,
      title: PropTypes.string,
      slug: PropTypes.string,
      dateCreated: PropTypes.string,
    })),
    lastUpdated: PropTypes.number,
  }).isRequired,
};

export default types;
