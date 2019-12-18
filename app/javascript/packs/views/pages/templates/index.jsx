import React, { Component, Fragment } from 'react'
import { Page, Layout, Card, ResourceList, Thumbnail, Pagination } from '@shopify/polaris'
import { SearchMinor, DeleteMinor } from '@shopify/polaris-icons'
import { connect } from 'react-redux'

import ConfirmModal from '../../components/confirm-modal'
import './template.scss'
import {
  loadTemplates,
  deleteTemplate
} from '../../../actions/template'

class Template extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      currentPage: 1,
      searchText: '',
      perPage: 10,
      id: null,
      confirming: false,
      confirmModal: false
    }
  }

  componentDidMount () {
    this.loadTemplates()
  }

  loadTemplates = () => {
    const { currentPage, searchText, perPage } = this.state
    this.setState({loading: true})
    this.props.loadTemplates({
      currentPage,
      searchText,
      perPage,
      cb: data => {
        this.setState({
          loading: false
        })
      }
    })
  }

  handleChange = property => value => {
    this.setState({
      [property]: value
    }, () => {
      this.loadTemplates()
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
      this.loadTemplates()
    })
  }

  addNewTemplate = () => {
    this.props.history.push('/templates/new')
  }

  editTemplate = id => {
    this.props.history.push(`/templates/${id}/edit`)
  }

  handleDelete = id => {
    this.setState({
      id: id,
      confirmModal: true
    })
  }

  deleteTemplate = () => {
    this.setState({confirming: true})
    let {id} = this.state
    this.props.deleteTemplate({
      id,
      cb: data => {
        this.setState({
          id: null,
          confirming: false,
          confirmModal: false
        }, () => {
          this.loadTemplates()
        })
      }
    })
  }

  toggleConfirm = confirmModal => {
    this.setState({confirmModal})
  }

  renderItem = item => {
    const { id, thumbnail, label } = item
    const media = <Thumbnail
      size="medium"
      source={thumbnail ? thumbnail : 'https://cdn.shopify.com/s/images/admin/no-image-compact.gif'}
    />
    const shortcutActions = [{content: 'Edit', icon: '', onAction: () => this.editTemplate(id) }, {content: '', icon: DeleteMinor, onAction: () => this.handleDelete(id)}]
    return (
      <ResourceList.Item
        id={id}
        media={media}
        accessibilityLabel={`View details for ${label}`}
        shortcutActions={shortcutActions}
        persistActions
      >
        <h2> { label } </h2>
      </ResourceList.Item>
    )
  }

  render () {
    const { loading, searchText, confirmModal, confirming } = this.state
    const { templates, hasNext, hasPrevious } = this.props

    const resourceName = {
      singular: 'template',
      plural: 'templates'
    }

    const filterControl = (
      <ResourceList.FilterControl
        searchValue={searchText}
        onSearchChange={this.handleChange('searchText')}
      />
    )

    return (
      <Page
        title="Templates"
        primaryAction={{
          content: 'Add template',
          onAction: this.addNewTemplate
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
                items={templates}
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
              </div>
            </Card>
          </Layout.Section>
        </Layout>
        <ConfirmModal
          active={confirmModal}
          confirming={confirming}
          title="Are you sure?"
          description="Do you really want to remove this record permanently?"
          onConfirm={this.deleteTemplate}
          toggleConfirm={this.toggleConfirm}
        />
      </Page>
    )
  }
}

const mapStateToProps = state => ({
  templates: state.template.templates,
  hasNext: state.template.hasNext,
  hasPrevious: state.template.hasPrevious
})

const mapDispatchToProps = {
  loadTemplates,
  deleteTemplate
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Template)