import React, { Component, Fragment } from 'react'
import { Page, Layout, Card, ResourceList, Thumbnail, Pagination } from '@shopify/polaris'
import { SearchMinor, DeleteMinor } from '@shopify/polaris-icons'
import { connect } from 'react-redux'

import ConfirmModal from '../../components/confirm-modal'

import {
  loadAttributes,
  deleteAttribute
} from '../../../actions/attribute'

class Attribute extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      currentPage: 1,
      totalPages: 1,
      searchText: '',
      perPage: 10,
      id: null,
      confirming: false,
      confirmModal: false
    }
  }

  componentDidMount () {
    this.loadAttributes()
  }

  loadAttributes = () => {
    const { currentPage, searchText, perPage } = this.state
    this.setState({loading: true})
    this.props.loadAttributes({
      currentPage,
      searchText,
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
      this.loadAttributes()
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
      this.loadAttributes()
    })
  }

  addNewAttribute = () => {
    this.props.history.push('/attributes/new')
  }

  editAttribute = id => {
    this.props.history.push(`/attributes/${id}/edit`)
  }

  handleDelete = id => {
    this.setState({
      id: id,
      confirmModal: true
    })
  }

  deleteAttribute = () => {
    this.setState({confirming: true})
    let {id} = this.state
    this.props.deleteAttribute({
      id,
      cb: data => {
        this.setState({
          id: null,
          confirming: false,
          confirmModal: false
        }, () => {
          this.loadAttributes()
        })
      }
    })
  }

  toggleConfirm = confirmModal => {
    this.setState({confirmModal})
  }

  renderItem = item => {
    const { id, label, attributeName, sku, category, type, amount } = item
    const shortcutActions = [{content: 'Edit', icon: '', onAction: () => this.editAttribute(id) }, {content: '', icon: DeleteMinor, onAction: () => this.handleDelete(id)}]
    return (
      <ResourceList.Item
        id={id}
        sku={sku}
        category={category}
        type={type}
        amount={amount}
        accessibilityLabel={`View details for ${attributeName}`}
        shortcutActions={shortcutActions}
        persistActions
      >
        <h2> { label } </h2>
      </ResourceList.Item>
    )
  }

  render () {
    const { loading, searchText, confirmModal, confirming } = this.state
    const { attributes, hasNext, hasPrevious, currentPage, totalPages } = this.props

    const resourceName = {
      singular: 'attribute',
      plural: 'attributes'
    }

    const filterControl = (
      <ResourceList.FilterControl
        searchValue={searchText}
        onSearchChange={this.handleChange('searchText')}
      />
    )

    return (
      <Page
        title="Attributes"
        primaryAction={{
          content: 'Add attribute',
          onAction: this.addNewAttribute
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
                items={attributes}
                renderItem={this.renderItem}
                filterControl={filterControl}
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
          onConfirm={this.deleteAttribute}
          toggleConfirm={this.toggleConfirm}
        />
      </Page>
    )
  }
}

const mapStateToProps = state => ({
  attributes: state.attribute.attributes,
  currentPage: state.attribute.currentPage,
  totalPages: state.attribute.totalPages,
  hasNext: state.attribute.hasNext,
  hasPrevious: state.attribute.hasPrevious
})

const mapDispatchToProps = {
  loadAttributes,
  deleteAttribute
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Attribute)