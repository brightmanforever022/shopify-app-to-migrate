import React, { Component, Fragment } from 'react'
import { Page, Layout, PageActions, Card, Button, FormLayout, TextField, ButtonGroup, Checkbox } from '@shopify/polaris'
import { connect } from 'react-redux'
import StorePicker from '../../templates/shared/store-picker'
import SkeletonLoader from '../../../components/skeleton-loader'

import ConfirmModal from '../../../components/confirm-modal'

import {
  loadFreightoption,
  createFreightoption,
  deleteFreightoption,
  updateFreightoption
} from '../../../../actions/freightoption'

class NewFreightoption extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      id: null,
      label: '',
      price: 0,
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
      this.props.loadFreightoption({
        id,
        cb: data => {
          this.setState({
            label: data.freightoption.label,
            price: data.freightoption.price,
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
    const { id, label, price } = this.state
    this.setState({saving: true})
    if (id) {
      this.props.updateFreightoption({
        id,
        label,
        price,
        cb: data => {
          this.setState({saving: false})
        }
      })
    } else {
      this.props.createFreightoption({
        label,
        price,
        cb: data => {
          this.setState({saving: false})
          this.props.history.push({
            pathname: `/freightoptions/${data.freightoption.id}/edit`,
          })
        }
      })
    }
  }

  render () {
    const { id, label, price, loading, saving, confirmModal, confirming } = this.state
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
            title={id ? 'Edit Freight Option' : 'New Freight Option'}
            primaryAction={primaryAction}
            breadcrumbs={[{content: 'Freight Options', url: '/freightoptions'}]}
          >
            <Layout>
              <Layout.Section>
                <Card
                  sectioned
                >
                    <Fragment>
                      <FormLayout.Group>
                        <TextField
                          value={label}
                          label="Option name"
                          minLength={100}
                          onChange={this.handleChange('label')}
                        />
                      </FormLayout.Group>
                      <FormLayout.Group>
                        <TextField
                          value={price}
                          onChange={this.handleChange('price')}
                          label="Price"
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
                onConfirm={this.deleteFreightoption}
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
  loadFreightoption,
  createFreightoption,
  deleteFreightoption,
  updateFreightoption
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewFreightoption)