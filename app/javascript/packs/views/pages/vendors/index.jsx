import React, { Component, Fragment } from 'react'
import { Page, Layout, Card, ResourceList, Pagination } from '@shopify/polaris'
import { DeleteMinor } from '@shopify/polaris-icons'
import { connect } from 'react-redux'

import ConfirmModal from '../../components/confirm-modal'

import {
  loadVendors,
  deleteVendor
} from '../../../actions/vendor'

class Vendor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      currentPage: 1,
      totalPages: 1,
      perPage: 10,
      id: null,
      confirming: false,
      confirmModal: false
    }
  }

  componentDidMount () {
    this.loadVendors()
  }

  loadVendors = () => {
    const { currentPage, perPage } = this.state
    this.setState({loading: true})
    this.props.loadVendors({
      currentPage,
      perPage,
      cb: data => {
        this.setState({
          loading: false,
          totalPages: data.totalPages
        })
      }
    })
  }

  handleChange = property => value => {
    this.setState({
      [property]: value
    }, () => {
      this.loadVendors()
    })
  }

  handlePage = direction => {
    let {currentPage} = this.state
    if (direction == 'prev') {
      currentPage -= 1
    } else {
      currentPage += 1
    }

    this.setState({currentPage}, () => {
      this.loadVendors()
    })
  }

  addNewVendor = () => {
    this.props.history.push('/vendors/new')
  }

  editVendor = id => {
    this.props.history.push(`/vendors/${id}/edit`)
  }

  handleDelete = id => {
    this.setState({
      id: id,
      confirmModal: true
    })
  }

  deleteVendor = () => {
    this.setState({confirming: true})
    let {id} = this.state
    this.props.deleteVendor({
      id,
      cb: data => {
        this.setState({
          id: null,
          confirming: false,
          confirmModal: false
        }, () => {
          this.loadVendors()
        })
      }
    })
  }

  toggleConfirm = confirmModal => {
    this.setState({confirmModal})
  }

  renderItem = item => {
    const { id, vendor_name, zip_code } = item
    const shortcutActions = [{content: 'Edit', icon: '', onAction: () => this.editVendor(id) }, {content: '', icon: DeleteMinor, onAction: () => this.handleDelete(id)}]
    return (
      <ResourceList.Item
        id={id}
        zip_code={zip_code}
        accessibilityLabel={`View details for ${vendor_name}`}
        shortcutActions={shortcutActions}
        persistActions
      >
        <div class="vendor-item">
          <h2> { vendor_name } </h2>
          <p> { zip_code } </p>
        </div>
      </ResourceList.Item>
    )
  }

  render () {
    const { loading, confirmModal, confirming } = this.state
    const { vendors, hasNext, hasPrevious, currentPage, totalPages } = this.props

    const resourceName = {
      singular: 'vendor',
      plural: 'vendors'
    }

    return (
      <Page
        title="Vendors"
        primaryAction={{
          content: 'Add Vendor',
          onAction: this.addNewVendor
        }}
      >
        <Layout>
          <Layout.Section>
            <Card
              sectioned
            >
              <ResourceList
                loading={ loading }
                resourceName={resourceName}
                items={vendors}
                renderItem={this.renderItem}
              />
              <div className="text-center mt-25">
                <Pagination
                  hasNext={hasNext}
                  hasPrevious={hasPrevious}
                  onPrevious={() => {this.handlePage('prev')}}
                  onNext={() => {this.handlePage('next')}}
                />
                <span className="pagination-info">Page {currentPage} of {totalPages}</span>
              </div>
            </Card>
          </Layout.Section>
        </Layout>
        <ConfirmModal
          active={confirmModal}
          confirming={confirming}
          title="Are you sure?"
          description="Do you really want to remove this record permanently?"
          onConfirm={this.deleteVendor}
          toggleConfirm={this.toggleConfirm}
        />
      </Page>
    )
  }
}

const mapStateToProps = state => ({
  vendors: state.vendor.vendors,
  currentPage: state.vendor.currentPage,
  totalPages: state.vendor.totalPages,
  hasNext: state.vendor.hasNext,
  hasPrevious: state.vendor.hasPrevious
})

const mapDispatchToProps = {
  loadVendors,
  deleteVendor
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Vendor)