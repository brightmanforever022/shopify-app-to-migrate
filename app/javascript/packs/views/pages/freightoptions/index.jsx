import React, { Component, Fragment } from 'react'
import { Page, Layout, Card, ResourceList, Pagination } from '@shopify/polaris'
import { DeleteMinor } from '@shopify/polaris-icons'
import { connect } from 'react-redux'

import ConfirmModal from '../../components/confirm-modal'

import {
  loadFreightoptions,
  deleteFreightoption
} from '../../../actions/freightoption'

class Freightoption extends Component {
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
    this.loadFreightoptions()
  }

  loadFreightoptions = () => {
    const { currentPage, perPage } = this.state
    this.setState({loading: true})
    this.props.loadFreightoptions({
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
      this.loadFreightoptions()
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
      this.loadFreightoptions()
    })
  }

  addNewFreightoption = () => {
    this.props.history.push('/freightoptions/new')
  }

  editFreightoption = id => {
    this.props.history.push(`/freightoptions/${id}/edit`)
  }

  handleDelete = id => {
    this.setState({
      id: id,
      confirmModal: true
    })
  }

  deleteFreightoption = () => {
    this.setState({confirming: true})
    let {id} = this.state
    this.props.deleteFreightoption({
      id,
      cb: data => {
        this.setState({
          id: null,
          confirming: false,
          confirmModal: false
        }, () => {
          this.loadFreightoptions()
        })
      }
    })
  }

  toggleConfirm = confirmModal => {
    this.setState({confirmModal})
  }

  renderItem = item => {
    const { id, label, price } = item
    const shortcutActions = [{content: 'Edit', icon: '', onAction: () => this.editFreightoption(id) }, {content: '', icon: DeleteMinor, onAction: () => this.handleDelete(id)}]
    return (
      <ResourceList.Item
        id={id}
        price={price}
        accessibilityLabel={`View details for ${label}`}
        shortcutActions={shortcutActions}
        persistActions
      >
        <h2> { label } </h2>
      </ResourceList.Item>
    )
  }

  render () {
    const { loading, confirmModal, confirming } = this.state
    const { freightoptions, hasNext, hasPrevious, currentPage, totalPages } = this.props

    const resourceName = {
      singular: 'freightoption',
      plural: 'freightoptions'
    }

    return (
      <Page
        title="Freightoptions"
        primaryAction={{
          content: 'Add Freight Option',
          onAction: this.addNewFreightoption
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
                items={freightoptions}
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
          onConfirm={this.deleteFreightoption}
          toggleConfirm={this.toggleConfirm}
        />
      </Page>
    )
  }
}

const mapStateToProps = state => ({
  freightoptions: state.freightoption.freightoptions,
  currentPage: state.freightoption.currentPage,
  totalPages: state.freightoption.totalPages,
  hasNext: state.freightoption.hasNext,
  hasPrevious: state.freightoption.hasPrevious
})

const mapDispatchToProps = {
  loadFreightoptions,
  deleteFreightoption
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Freightoption)