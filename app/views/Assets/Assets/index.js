import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { formatDate, formatBytes } from 'utils/helpers';
import DeleteIcon from 'components/DeleteIcon';
import Page from 'containers/Page';
import Table from 'components/Table';
import Button from 'components/Button';
import TitleBar from 'components/TitleBar';
import { deleteAsset, indexAssets } from 'actions/assetActions';
import t from 'utils/types';

export default class Assets extends Component {
  static propTypes = {
    assets: t.assets.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  indexAssets() {
    this.props.dispatch(indexAssets());
  }

  render() {
    const { assets, dispatch } = this.props;

    const reduced = assets.assets.map(props => ({
      key: props._id,
      image: {
        sortBy: false,
        component: <Link to={`/settings/assets/${props._id}`}><img src={`/public/assets/${props.filename}`} alt={props.filename} /></Link>,
      },
      title: {
        value: props.title,
        component: <Link to={`/settings/assets/${props._id}`}>{props.title}</Link>,
      },
      filename: props.filename,
      size: formatBytes(props.size, 0),
      dateCreated: {
        value: new Date(props.dateCreated).getTime(),
        component: formatDate(props.dateCreated),
      },
      delete: {
        sortBy: false,
        component: <DeleteIcon
          dispatch={dispatch}
          onClick={() => dispatch(deleteAsset(props._id))}
          message="Are you sure you want to delete this asset?"
        />,
      },
    }));

    return (
      <Page name="assets">
        <TitleBar title="Assets">
          <Button onClick={() => this.indexAssets()} small>Index Asset</Button>
          <Link to="/settings/assets/new" className="btn btn--small">New Asset</Link>
        </TitleBar>

        <div className="content">
          <div className="page__inner">
            {reduced.length > 0 ? <Table data={reduced} /> : <h3>No assets!</h3>}
          </div>
        </div>
      </Page>
    );
  }
}
