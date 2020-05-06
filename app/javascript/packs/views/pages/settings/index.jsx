import React, { Component, Fragment } from 'react'
import { Page, Layout, PageActions, Card, Button, FormLayout, TextField, ButtonGroup, Checkbox } from '@shopify/polaris'
import { connect } from 'react-redux'
import SkeletonLoader from '../../components/skeleton-loader'

import ConfirmModal from '../../components/confirm-modal'

import {
  loadSettings,
  updateSettings
} from '../../../actions/settings'

class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      key: 0,
      saving: false,
      confirming: false,
      confirmModal: false,

      shipping_markup: 0,
    }
  }

  componentDidMount () {
    const id = 1
    this.setState({loading: true})
    this.props.loadSettings({
      id,
      cb: data => {
        this.setState({
          shipping_markup: data.settings.shipping_markup,
          loading: false
        })
      }
    })
  }

  handleChange = property => value => {
    this.setState({[property]: value})
  }

  handleSave = () => {
    const { shipping_markup } = this.state
    
    this.setState({saving: true})
    this.props.updateSettings({
      shipping_markup,
      cb: data => {
        this.setState({saving: false})
      }
    })
  }

  render () {
    const { shipping_markup, loading, saving, confirmModal, confirming } = this.state
    
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
            title={'Edit Settings'}
            primaryAction={primaryAction}
            breadcrumbs={[{content: 'Options', url: '/attributes'}]}
          >
            <Layout>
              <Layout.Section>
                <Card
                  sectioned
                >
                    <Fragment>
                      <FormLayout.Group>
                        <TextField
                          value={shipping_markup}
                          label="Shipping Markup (%)"
                          onChange={this.handleChange('shipping_markup')}
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
                onConfirm={this.deleteAttribute}
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
  loadSettings,
  updateSettings
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings)