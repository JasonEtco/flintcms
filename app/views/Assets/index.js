import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { formatDate, formatBytes } from '../../utils/helpers';
import DeleteIcon from '../../components/DeleteIcon';
import Page from '../../containers/Page';
import Table from '../../components/Table';
import Button from '../../components/Button';
import TitleBar from '../../components/TitleBar';
import { deleteAsset, indexAssets } from '../../actions/assetActions';

export default class Assets extends Component {
  static propTypes = {
    assets: PropTypes.object,
    dispatch: PropTypes.func,
  }

  static defaultProps = {
    assets: null,
    dispatch: null,
  }

  indexAssets() {
    this.props.dispatch(indexAssets());
  }

  render() {
    const { assets, dispatch } = this.props;

    const reduced = assets.assets.map(props => ({
      key: props._id,
      title: {
        value: props.title,
        component: <a href={`/public/assets/${props.filename}`} rel="noopener noreferrer" target="_blank">{props.title}</a>,
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
          <Link to="/admin/settings/assets/new" className="btn btn--small">New Asset</Link>
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
