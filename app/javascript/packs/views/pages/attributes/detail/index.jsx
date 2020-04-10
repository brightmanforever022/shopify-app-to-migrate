import React, { Component, Fragment } from 'react'
import { Page, Layout, PageActions, Card, Button, FormLayout, TextField, ButtonGroup, Checkbox } from '@shopify/polaris'
import { connect } from 'react-redux'
import StorePicker from '../../templates/shared/store-picker'
import SkeletonLoader from '../../../components/skeleton-loader'

import ConfirmModal from '../../../components/confirm-modal'

import {
  loadAttribute,
  listStores,
  createAttribute,
  deleteAttribute,
  updateAttribute
} from '../../../../actions/attribute'

class NewAttribute extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      id: null,
      index: 0,
      label: '',
      price: 0,
      price_type: false,
      weight: 0,
      width: 0,
      length: 0,
      girth: 0,
      weight2: 0,
      width2: 0,
      length2: 0,
      girth2: 0,
      weight3: 0,
      width3: 0,
      length3: 0,
      girth3: 0,
      attribute_code: '',
      postal_code: '',
      freight: false,
      min_ship_quantity: 0,
      max_ship_quantity: 0,
      ship_price_percent: 0,
      store_list: [],
      selectedStoreList: '',
      vendor_sku: '',
      key: 0,
      saving: false,
      confirming: false,
      confirmModal: false,
      storeSelectModal: false,
    }

    this.handleTypeChange = this.handleTypeChange.bind(this)
    this.handleFreightChange = this.handleFreightChange.bind(this)
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
      this.props.loadAttribute({
        id,
        cb: data => {
          this.setState({
            label: data.attribute.label,
            price: data.attribute.price,
            price_type: data.attribute.price_type,
            weight: data.attribute.weight,
            width: data.attribute.width,
            length: data.attribute.length,
            girth: data.attribute.girth,
            weight2: data.attribute.weight2,
            width2: data.attribute.width2,
            length2: data.attribute.length2,
            girth2: data.attribute.girth2,
            weight3: data.attribute.weight3,
            width3: data.attribute.width3,
            length3: data.attribute.length3,
            girth3: data.attribute.girth3,
            attribute_code: data.attribute.attribute_code,
            postal_code: data.attribute.postal_code,
            freight: data.attribute.freight,
            selectedStoreList: data.attribute.store_list,
            vendor_sku: data.attribute.vendor_sku,
            store_list: data.storeList,
            min_ship_quantity: data.attribute.min_ship_quantity,
            max_ship_quantity: data.attribute.max_ship_quantity,
            ship_price_percent: data.attribute.ship_price_percent,
            loading: false
          })
        }
      })
    } else {
      this.setState({loading: true})
      this.props.listStores({
        cb: data => {
          this.setState({
            store_list: data.storeList,
            loading: false
          })
        }
      })
    }

  }

  handleChange = property => value => {
    this.setState({[property]: value})
  }

  handleTypeChange = event => {
    this.setState({price_type: event.target.value})
  }

  handleFreightChange = event => {
    const { freight } = this.state
    this.setState({ freight: !freight })
  }

  selectStoreModalOpen = () => {
    this.setState({
      storeSelectModal: true
    })
  }

  setStorePicker = params => {
    let selectedStores = params.selectedStores.join(',')
    this.setState({
      selectedStoreList: selectedStores,
      storeSelectModal: false
    })
  }

  toggleStorePicker = storeSelectModal => {
    this.setState({storeSelectModal})
  }

  handleSave = () => {
    const { id, label, price, price_type, weight, width, length, girth, weight2, width2, length2, girth2, weight3, width3, length3, girth3, attribute_code, postal_code, freight, selectedStoreList, vendor_sku, min_ship_quantity, max_ship_quantity, ship_price_percent } = this.state
    this.setState({saving: true})
    let store_list = selectedStoreList
    if (id) {
      this.props.updateAttribute({
        id,
        label,
        price,
        price_type,
        weight,
        width,
        length,
        girth,
        weight2,
        width2,
        length2,
        girth2,
        weight3,
        width3,
        length3,
        girth3,
        attribute_code,
        postal_code,
        freight,
        store_list,
        vendor_sku,
        min_ship_quantity,
        max_ship_quantity,
        ship_price_percent,
        cb: data => {
          this.setState({saving: false})
        }
      })
    } else {
      this.props.createAttribute({
        label,
        price,
        price_type,
        weight,
        width,
        length,
        girth,
        weight2,
        width2,
        length2,
        girth2,
        weight3,
        width3,
        length3,
        girth3,
        attribute_code,
        postal_code,
        freight,
        store_list,
        vendor_sku,
        min_ship_quantity,
        max_ship_quantity,
        ship_price_percent,
        cb: data => {
          this.setState({saving: false})
          this.props.history.push({
            pathname: `/attributes/${data.attribute.id}/edit`,
          })
        }
      })
    }
  }

  render () {
    const { id, label, price, price_type, weight, width, length, girth, weight2, width2, length2, girth2, weight3, width3, length3, girth3, attribute_code, postal_code, freight, store_list, selectedStoreList, vendor_sku, min_ship_quantity, max_ship_quantity, ship_price_percent, loading, saving, confirmModal, storeSelectModal, confirming } = this.state
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
            title={id ? 'Edit Option' : 'New Option'}
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
                        <label>
                          Upcharge Type<br/>
                          <select value={price_type} onChange={this.handleTypeChange} className="select-type">
                            <option value="false">Add On</option>
                            <option value="true">Percent</option>
                          </select>
                        </label>
                        <TextField
                          value={attribute_code}
                          onChange={this.handleChange('attribute_code')}
                          label="Attribute Code"
                        />
                        <TextField
                          value={postal_code}
                          onChange={this.handleChange('postal_code')}
                          label="Postal Code"
                        />
                        <label className="store-list">
                          Store Name<br/>
                          <Button outline onClick={() => {this.selectStoreModalOpen()}}>Select Stores</Button>
                        </label>
                        <TextField
                          value={vendor_sku}
                          onChange={this.handleChange('vendor_sku')}
                          label="Vendor SKU"
                        />
                        <TextField
                          value={min_ship_quantity}
                          onChange={this.handleChange('min_ship_quantity')}
                          label="Minimal Ship Quantity"
                        />
                        <TextField
                          value={max_ship_quantity}
                          onChange={this.handleChange('max_ship_quantity')}
                          label="Maximum Ship Quantity"
                        />
                        <TextField
                          value={ship_price_percent}
                          onChange={this.handleChange('ship_price_percent')}
                          label="Ship Price Percent"
                        />
                        <TextField
                          value={width}
                          onChange={this.handleChange('width')}
                          label="Width"
                        />
                        <TextField
                          value={length}
                          onChange={this.handleChange('length')}
                          label="Length"
                        />
                        <TextField
                          value={girth}
                          onChange={this.handleChange('girth')}
                          label="Height"
                        />
                        <TextField
                          value={width2}
                          onChange={this.handleChange('width2')}
                          label="Second Width"
                        />
                        <TextField
                          value={length2}
                          onChange={this.handleChange('length2')}
                          label="Second Length"
                        />
                        <TextField
                          value={girth2}
                          onChange={this.handleChange('girth2')}
                          label="Second Height"
                        />
                        <TextField
                          value={width3}
                          onChange={this.handleChange('width3')}
                          label="Third Width"
                        />
                        <TextField
                          value={length3}
                          onChange={this.handleChange('length3')}
                          label="Third Length"
                        />
                        <TextField
                          value={girth3}
                          onChange={this.handleChange('girth3')}
                          label="Third Height"
                        />
                        <TextField
                          value={weight}
                          onChange={this.handleChange('weight')}
                          label="Weight"
                        />
                        <TextField
                          value={weight2}
                          onChange={this.handleChange('weight2')}
                          label="Second Weight"
                        />
                        <TextField
                          value={weight3}
                          onChange={this.handleChange('weight3')}
                          label="Third Weight"
                        />
                        <Checkbox
                          label="Freight"
                          checked={freight}
                          onChange={this.handleFreightChange}
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
              <StorePicker
                active = {storeSelectModal}
                storeList = {store_list}
                selecteds = {selectedStoreList.split(',')}
                togglePicker = {this.toggleStorePicker}
                onConfirm={this.setStorePicker}
              >
              </StorePicker>
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
  loadAttribute,
  listStores,
  createAttribute,
  deleteAttribute,
  updateAttribute
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewAttribute)