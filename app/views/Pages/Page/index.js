import React, { Component } from 'react';
import PropTypes from 'prop-types';
import serialize from 'form-serialize';
import t from 'utils/types';
import renderOption from 'utils/renderOption';
import getUserPermissions from 'utils/getUserPermissions';
import validateFields from 'utils/validateFields';
import PageWrapper from 'containers/Page';
import TitleBar from 'components/TitleBar';
import Button from 'components/Button';
import Input from 'components/Input';
import Aside from 'containers/Aside';
import { deletePage, updatePage, pageDetails } from 'actions/pageActions';
import { openModal } from 'actions/uiActions';
import ConfirmModal from 'components/Modals/ConfirmModal';
import { withRouter } from 'react-router';

export default withRouter(class Page extends Component {
  static propTypes = {
    pages: t.pages.isRequired,
    fields: t.fields.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.renderFields = this.renderFields.bind(this);
    this.deletePage = this.deletePage.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  state = { status: null }

  componentDidMount() {
    const { dispatch, match, pages } = this.props;
    const { full } = pages.pages.find(e => e._id === match.params.id);
    if (!full || full === undefined) {
      dispatch(pageDetails(match.params.id));
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const { match, dispatch } = this.props;
    const data = serialize(this.page.form, { hash: true });
    const { title, dateCreated, ...fields } = data;

    const invalidFields = validateFields(fields);
    if (invalidFields.length !== 0) return;

    dispatch(updatePage(match.params.id, data));
  }

  deletePage() {
    const { match, dispatch } = this.props;
    dispatch(openModal(
      <ConfirmModal
        confirm={() => dispatch(deletePage(match.params.id, true))}
        message={'Are you sure you want to delete this page?'}
      />),
    );
  }

  renderFields(pageFields, fieldId) {
    const { fields } = this.props.fields;
    const foundField = fields.find(f => f._id === fieldId);
    const pageField = pageFields.find(f => f.fieldId === fieldId);

    return renderOption(foundField, pageField ? pageField.value : null, {
      disabled: !getUserPermissions().pages.canEditPages,
    });
  }

  render() {
    const { match, pages } = this.props;

    const {
      title,
      _id,
      full,
      fields,
      fieldLayout,
      dateCreated,
    } = pages.pages.find(e => e._id === match.params.id);

    // TODO: Render loader
    if (full === undefined) return null;

    const links = [
      { label: 'Pages', path: '/pages' },
      { label: title, path: `/pages/${_id}` },
    ];

    const { canEditPages, canDeletePages } = getUserPermissions().pages;

    return (
      <PageWrapper name="page" links={links} onSubmit={this.onSubmit} ref={(r) => { this.page = r; }}>
        <TitleBar title={title}>
          {canEditPages && <Button small onClick={this.Submit} type="submit">Save Page</Button>}
          {canDeletePages && <Button small onClick={this.deletePage}>Delete Page</Button>}
        </TitleBar>
        <div className="content">
          <div className="page__inner">
            <Input label="Title" defaultValue={title} name="title" full required disabled={!canEditPages} />
            {fieldLayout.map(fieldId => this.renderFields(fields, fieldId))}
          </div>

          <Aside noStatus dateCreated={dateCreated} disabled={!canEditPages} />
        </div>
      </PageWrapper>
    );
  }
});
