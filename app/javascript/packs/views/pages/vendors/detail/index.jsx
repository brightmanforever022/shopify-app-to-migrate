import React, { Component, Fragment } from 'react'
import { Page, Layout, PageActions, Card, FormLayout, TextField } from '@shopify/polaris'
import { connect } from 'react-redux'
import SkeletonLoader from '../../../components/skeleton-loader'

import ConfirmModal from '../../../components/confirm-modal'

import {
  loadVendor,
  createVendor,
  deleteVendor,
  updateVendor
} from '../../../../actions/vendor'

class NewVendor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      id: null,
      vendor_name: '',
      zip_code: '',
      description: '',
      saving: false,
      confirming: false,
      confirmModal: false,
    }
  }

  UNSAFE_componentWillMount () {
    this.setState({
      id: this.props.match.params.id
    })
  }

  componentDidMount () {
    const { id } = this.state
    if (id) {
      this.setState({loading: true})
      this.props.loadVendor({
        id,
        cb: data => {
          this.setState({
            vendor_name: data.vendor.vendor_name,
            zip_code: data.vendor.zip_code,
            loading: false
          })
        }
      })
    }
  }

  handleChange = property => value => {
    this.setState({[property]: value})
  }

  handleSave = () => {
    const { id, vendor_name, zip_code } = this.state
    this.setState({saving: true})
    if (id) {
      this.props.updateVendor({
        id,
        vendor_name,
        zip_code,
        cb: data => {
          this.setState({saving: false})
        }
      })
    } else {
      this.props.createVendor({
        vendor_name,
        zip_code,
        cb: data => {
          this.setState({saving: false})
          this.props.history.push({
            pathname: `/vendors/${data.vendor.id}/edit`,
          })
        }
      })
    }
  }

  render () {
    const { id, vendor_name, zip_code, loading, saving, confirmModal, confirming } = this.state
    const primaryAction = {
      content: 'Save',
      loading: saving,
      onAction: this.handleSave
    }

    const secondaryActions = null
    
    return (
      <Fragment>
        {
          !loading &&
          <Page
            title={id ? 'Edit Vendor' : 'New Vendor'}
            primaryAction={primaryAction}
            breadcrumbs={[{content: 'Vendors', url: '/vendors'}]}
          >
            <Layout>
              <Layout.Section>
                <Card
                  sectioned
                >
                    <Fragment>
                      <FormLayout.Group>
                        <TextField
                          value={vendor_name}
                          label="Vendor name"
                          minLength={5}
                          onChange={this.handleChange('vendor_name')}
                        />
                      </FormLayout.Group>
                      <FormLayout.Group>
                        <TextField
                          value={zip_code}
                          onChange={this.handleChange('zip_code')}
                          label="Zip Code"
                        />
                      </FormLayout.Group>
                    </Fragment>
                </Card>
              </Layout.Section>
              <Layout.Section>
                <PageActions
                  primaryAction={primaryAction}
                  secondaryActions={secondaryActions}
                />
              </Layout.Section>
              <ConfirmModal
                active={confirmModal}
                confirming={confirming}
                title="Are you sure?"
                description="Do you really want to remove this record permanently?"
                onConfirm={this.deleteVendor}
                toggleConfirm={this.toggleConfirm}
              />
            </Layout>
          </Page>
        }
        {
          loading && <SkeletonLoader level={2}/>
        }
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  
})

const mapDispatchToProps = {
  loadVendor,
  createVendor,
  deleteVendor,
  updateVendor
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewVendor)