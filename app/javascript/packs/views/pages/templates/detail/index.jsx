import React, { Component, Fragment } from 'react'
import { Page, Layout, PageActions, Card, Stack, TextStyle, Button, Thumbnail, TextContainer, FormLayout, TextField, ButtonGroup, Autocomplete, Icon, Collapsible, ResourceList } from '@shopify/polaris'
import { SearchMinor, DeleteMajorMonotone, ChevronDownMinor, ChevronUpMinor } from '@shopify/polaris-icons'
import { connect } from 'react-redux'
import VariantsPicker from '../shared/variants-picker'
import ProductPicker from '../shared/product-picker'
import ExclusionPicker from '../shared/exclusion-picker'
import SkeletonLoader from '../../../components/skeleton-loader'

import ConfirmModal from '../../../components/confirm-modal'

import {
  loadVariant,
  // loadVariants,
  loadProduct,
} from '../../../../actions/product'

import {
  loadTemplate,
  createTemplate,
  deleteTemplate,
  updateTemplate
} from '../../../../actions/template'

import {
  searchAttributes
} from '../../../../actions/attribute'

class NewTemplate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      productModal: false,
      variantsModal: false,
      modalType: 'variant',
      exclusionModal: false,
      selectedGroupIndex: 0,
      selectedExclusions: '',
      selectedAttributeIndex: 0,
      exclusionAttributeList: [],
      product: null,
      label: '',
      id: null,
      variants: [],
      groups: [],
      index: 0,
      key: 0,
      saving: false,
      confirming: false,
      confirmModal: false,
      selecteds: [],
      deselectedAttributeOptions: [],
      attributeOptions: [],
      selectedAttributeOptions: [],
      inputAttributeValue: '',
      newOptionShow: [],
      openGroup: [],
    }

    this.handlePriceType = this.handlePriceType.bind(this)
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
      this.props.loadTemplate({
        id,
        cb: data => {
          if (data.template.shopify_product_id) {
            this.loadProduct(data.template.shopify_product_id)
          }
          var attributeList = data.attributeList.map(att => {
            return {
              value: att.id,
              label: att.label,
              price: att.price,
              price_type: att.price_type,
              weight: att.weight,
              width: att.width,
              length: att.length,
              girth: att.girth,
              width2: att.width2,
              length2: att.length2,
              girth2: att.girth2,
              width3: att.width3,
              length3: att.length3,
              girth3: att.girth3,
              attribute_code: att.attibute_code ? att.attribute_code : '',
              store_name: att.store_name,
              vendor_sku: att.vendor_sku,
              postal_code: att.postal_code
            }
          })
          var newOptionShow = []
          var openGroup = []
          for (let i = 0; i < data.template.groups.length; i++) {
            newOptionShow[i] = false
            openGroup[i] = true
          }
          this.setState({
            // variants: data.variants.data.nodes,
            groups: data.template.groups,
            label: data.template.label,
            loading: false,
            deselectedAttributeOptions: attributeList,
            newOptionShow: newOptionShow,
            openGroup: openGroup
          })
        }
      })
    }
  }

  openModal = modalType => {
    const { variants } = this.state
    const selecteds = variants.map(v => ({variant_id: this.convertId(v.id)}))
    this.setState({
      variantsModal: true,
      modalType: modalType,
      selecteds: selecteds
    })
  }

  toggleVariantsPicker = variantsModal => {
    this.setState({variantsModal})
  }

  setVariantsPicker = params => {
    this.setState({variantsModal: false})
    if (params.selecteds.length < 1) {
      return false
    }
    if (this.state.modalType == 'product') {
      this.loadVariants(params.selecteds.map(selected => selected.variant_id))
    } else {
      this.loadVariant(params.selecteds[0].variant_id)
    }
  }

  openProductModal = () => {
    this.setState({productModal: true})
  }

  toggleProductPicker = productModal => {
    this.setState({productModal})
  }

  setProductPicker = params => {
    this.setState({productModal: false})
    if (!params.productData) {
      return false
    }
  }

  getExclusionList = (index, id) => {
    const { groups } = this.state
    const group = groups[index]
    const drellation = group.drellations.find(dr => dr.dattribute_id == id)
    return drellation.excepts
  }

  openExclusionModal = (index, id) => {
    const { groups } = this.state
    let exclusionAttributeList = []
    groups.map((gr, grIndex) => {
      if (index != grIndex) {
        exclusionAttributeList.push({groupLabel: gr.label, groupId: gr.id, daList: gr.dattributes})
      }
    })
    const group = groups[index]
    const drellation = group.drellations.find(dr => dr.dattribute_id == id)
    this.setState({
      exclusionModal: true,
      selectedGroupIndex: index,
      selectedAttributeIndex: id,
      selectedExclusions: drellation.excepts,
      exclusionAttributeList: exclusionAttributeList
    })
  }

  toggleExclusionPicker = exclusionModal => {
    this.setState({exclusionModal})
  }

  setExclusionPicker = params => {
    const { groups, selectedGroupIndex, selectedAttributeIndex } = this.state
    groups[selectedGroupIndex].drellations = groups[selectedGroupIndex].drellations.map(dr => {
      if (dr.dattribute_id == selectedAttributeIndex) {
        dr.excepts = params.exclusionList.join(',')
        return dr
      } else {
        return dr
      }
    })
    this.setState({
      groups: groups,
      exclusionModal: false
    })
  }

  loadProduct  = id => {
    this.props.loadProduct({
      id,
      cb: data => {
        this.setState({
          product: data.data
        })
      }
    })
  }

  loadVariant = id => {
    let { groups, index, key } = this.state
    this.props.loadVariant({
      id,
      cb: data => {
        groups[index].dattributes[key].shopify_variant_id = id
        groups[index].dattributes[key].price = Number(data.data.price)
        groups[index].dattributes[key].shopify_variant_title = data.data.displayName
        this.setState({
          groups: groups
        })
      }
    })
  }

  loadVariants = selecteds => {
    this.props.loadVariants({
      selecteds,
      cb: data => {
        this.setState({
          variants: data.data.nodes
        })
      }
    })
  }

  reorderAttributes = () => {
    console.log('reorder attributes')
  }

  addGroup = () => {
    let { groups } = this.state
    let { openGroup } = this.state
    openGroup[openGroup.length] = true
    let default_group = {
      label: '',
      is_required: false,
      dattributes: []
    }
    this.setState({
      groups: [...groups, default_group],
      openGroup: openGroup
    })
  }

  removeGroup = index => {
    let { groups } = this.state
    this.setState({
      groups: groups.filter((group,i) => i !== +index)
    })
  }

  toggleGroup = index => {
    let { openGroup } = this.state
    openGroup[index] = !openGroup[index]
    this.setState({
      openGroup: openGroup
    })
  }

  handleGroupLabel = index => value => {
    let { groups } = this.state
    groups[index].label = value
    this.setState({groups: groups})
  }

  addOption = index => {
    var newOptionShow = this.state.newOptionShow
    newOptionShow[index] = true
    this.setState({newOptionShow: newOptionShow})
  }

  handleItem = (property, index, key) => value => {
    let { groups } = this.state
    groups[index].dattributes[key][property] = value
    this.setState({groups: groups})
  }

  handlePriceType = (index, key) => evt => {
    let { groups } = this.state
    groups[index].dattributes[key]['price_type'] = evt.target.value
    this.setState({groups: groups})
  }

  handleVariantsChoice = selecteds => {
    this.setState({selecteds})
  }

  handleProductChoice = product => {
    this.setState({product})
  }

  handleChange = property => value => {
    this.setState({[property]: value})
  }

  removeItem = (index, itemId) => {
    let { groups } = this.state
    let dattributes = groups[index].dattributes.filter((da, i) => da.id !== +itemId)
    let drellations = groups[index].drellations.filter((dr, i) => dr.dattribute_id !== +itemId)
    groups[index].dattributes = dattributes
    groups[index].drellations = drellations
    this.setState({groups: groups})
  }

  handleSave = () => {
    const { /*variants, */groups, id, label, product } = this.state
    if (!product) {
      alert('No product assigned')
      return false
    }
    const product_id = product.id.split('/')[product.id.split('/').length - 1]
    this.setState({saving: true})
    if (id) {
      this.props.updateTemplate({
        id,
        // variants,
        groups,
        label,
        product_id,
        cb: data => {
          this.setState({saving: false})
        }
      })
    } else {
      this.props.createTemplate({
        label,
        // variants,
        groups,
        product_id,
        cb: data => {
          this.setState({saving: false})
          this.props.history.push({
            pathname: `/templates/${data.template.id}/edit`,
          })
        }
      })
    }
  }

  convertId = graphId => {
    return Number(graphId.split('/')[graphId.split('/').length - 1])
  }

  updateAttributeText = index => value => {
    this.setState({inputAttributeValue: value})
    
    if (value === '') {
      this.setState({attributeOptions: this.state.deselectedAttributeOptions})
      return
    }
    this.props.searchAttributes({
      searchText: value,
      cb: data => {
        var attributeList = data.attributes.map(att => {
          return {
            value: att.id,
            label: att.label,
            price: att.price,
            price_type: att.price_type,
            weight: att.weight,
            width: att.width,
            length: att.length,
            girth: att.girth,
            width2: att.width2,
            length2: att.length2,
            girth2: att.girth2,
            width3: att.width3,
            length3: att.length3,
            girth3: att.girth3,
            attribute_code: att.attibute_code ? att.attribute_code : '',
            store_name: att.store_name,
            vendor_sku: att.vendor_sku,
            postal_code: att.postal_code
          }
        })
        this.setState({deselectedAttributeOptions: attributeList, attributeOptions: attributeList})
      }
    })
  }

  updateAttributeSelection = index => selected => {
    let { groups } = this.state
    
    const selectedValue = selected.map((selectedItem) => {
      const matchedOption = this.state.attributeOptions.find((option) => option.value.toString().match(selectedItem))
      return matchedOption
    })
    // Check if this selected option exists in option list of current group
    if (groups[index].dattributes) {
      const currentDattributeIDList = groups[index].dattributes.map(da => da.id)
      if (currentDattributeIDList.includes(selectedValue[0].value)) {
        return false
      }
    } else {
      groups[index].dattributes = []
    }

    if (!groups[index].drellations) {
      groups[index].drellations = []
    }

    this.setState({selectedAttributeOptions: selected})
    this.setState({inputAttributeValue: selectedValue[0].label})
    
    let newOption = {
      id: selectedValue[0].value,
      label: selectedValue[0].label,
      price: selectedValue[0].price,
      price_type: selectedValue[0].price_type,
      weight: selectedValue[0].weight,
      width: selectedValue[0].width,
      length: selectedValue[0].length,
      girth: selectedValue[0].girth,
      width2: selectedValue[0].width2,
      length2: selectedValue[0].length2,
      girth2: selectedValue[0].girth2,
      width3: selectedValue[0].width3,
      length3: selectedValue[0].length3,
      girth3: selectedValue[0].girth3,
      attribute_code: selectedValue[0].attribute_code,
      store_name: selectedValue[0].store_name,
      vendor_sku: selectedValue[0].vendor_sku,
      postal_code: selectedValue[0].postal_code
    }
    let newRellation = {
      dattribute_id: selectedValue[0].value,
      table_row: '0',
      excepts: ''
    }
    groups[index].dattributes = [...groups[index].dattributes, newOption]
    groups[index].drellations = [...groups[index].drellations, newRellation]

    var newOptionShow = this.state.newOptionShow
    newOptionShow[index] = false
    this.setState({groups: groups, newOptionShow: newOptionShow})
  }

  changeTableRow = (index, id, evt) => {
    const { groups } = this.state
    const tableRowRegex = /^[0-9,]+$/
    if (tableRowRegex.test(evt)) {
      groups[index].drellations.map(dr => {
        if (dr.dattribute_id == id) {
          dr.table_row = evt
          return dr
        } else {
          return dr
        }
      })
      this.setState({ groups: groups })
    }
  }

  renderItem = index => item => {
    const { id, label, price, price_type, length, width, girth, attribute_code, weight, store_name, vendor_sku, postal_code } = item
    
    // find drellation related with this item
    const { groups } = this.state
    const drellation = groups[index].drellations.find(dr => dr.dattribute_id == id)
    let table_row = drellation.table_row
    
    // define whether button text is 'add exclusions' or 'edit exclusions'
    let exceptList = this.getExclusionList(index, id)
    exceptList = exceptList.split(',').filter(ex => ex != "")
    let exclusionButtonString = 'Add exclusions'
    if (exceptList.length > 0) {
      exclusionButtonString = 'Edit exclusions'
    }
    return (
      <ResourceList.Item
        id={"" + index + "-" + id}
        accessibilityLabel={`View details for ${label}`}
        persistActions
      >
        <div className="attribute-item" key={"attribute-item" + index + "-" + id}>
          <div className="option-item">{ label } <br/>{ store_name }</div>
          <div className="option-item">{ (price_type ? '' : '$') + price + (price_type ? ' %' : '') }</div>
          <div className="option-item">
            <TextField
              label="Table Row"
              labelHidden="TRUE"
              value={ table_row }>
              onChange={ (e) => this.changeTableRow(index, id, e) }
            </TextField>
          </div>
          <div className="option-item">{ length + '" x ' + width + '" x ' + girth + '"' }<br/>{ weight + 'kg' }</div>
          <div className="option-item">{ attribute_code }<br/>{ vendor_sku }</div>
          <div className="option-item">{ postal_code }</div>
        </div>
        <div className="attribute-action-list mt-25" key={"attribute-action" + index + "-" + id}>
          <div className="attribute-action"><Button primary onClick={() => this.openExclusionModal(index, id)}>{ exclusionButtonString }</Button></div>
          <div className="attribute-action"><Button external url={"/attributes/" + id + "/edit"}>Edit option</Button></div>
          <div className="attribute-action"><Button icon={DeleteMajorMonotone} onClick={() => this.removeItem(index, id)}></Button></div>
        </div>
      </ResourceList.Item>
    )
  }

  render () {
    const { label, loading, variantsModal, productModal, modalType, variants, groups, saving, id, confirmModal, confirming, selecteds, product, inputAttributeValue, attributeOptions, selectedAttributeOptions, exclusionModal, selectedExclusions, exclusionAttributeList } = this.state
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
            title={id ? 'Edit template' : 'New template'}
            primaryAction={primaryAction}
            breadcrumbs={[{content: 'Templates', url: '/templates'}]}
          >
            <Layout>
              <Layout.Section>
                <Card
                  sectioned
                  title="Template name"
                >
                  <TextField
                    value={label}
                    label="template name"
                    labelHidden
                    onChange={this.handleChange('label')}
                  />
                </Card>
              </Layout.Section>
              <Layout.Section>
                <Card
                  sectioned
                  title="Product"
                >
                  {(() => {
                    if (product) {
                      return (
                        <FormLayout>
                          <Stack>
                            <Stack.Item>
                              <Thumbnail
                                size="medium"
                                source={product.featuredImage ? product.featuredImage.transformedSrc : 'https://cdn.shopify.com/s/images/admin/no-image-compact.gif'}
                              />
                            </Stack.Item>
                            <Stack.Item fill>
                              <TextContainer spacing="tight">
                                <p>{product.title}</p>
                              </TextContainer>
                            </Stack.Item>
                            <Stack>
                            <TextStyle variation={product.totalInventory >= 0 ? 'positive' : 'negative'}>
                              {product.totalInventory}
                            </TextStyle>
                            </Stack>
                          </Stack>
                          <hr/>
                        </FormLayout>
                      )
                    } else {
                      return (
                        <FormLayout>
                          <Stack>
                            <Stack.Item
                              fill
                            >
                              <TextStyle
                                variation="subdued"
                              >No product assigned</TextStyle>
                            </Stack.Item>
                          </Stack>
                        </FormLayout>
                      )
                    }
                  })()}
                  <Stack>
                    <Stack.Item fill>
                    </Stack.Item>
                    <Stack.Item>
                      <ButtonGroup>
                        <Button primary onClick={() => this.reorderAttributes()}>Reorder Attributes</Button>
                        <Button primary onClick={() => {this.addGroup()}}>New Attribute</Button>
                        <Button
                          onClick={() => {this.openProductModal()}}
                        >
                          Assign Product
                        </Button>
                      </ButtonGroup>
                    </Stack.Item>
                  </Stack>
                </Card>
              </Layout.Section>
              <Layout.Section>
                {groups.map((group, index) => {
                  var groupCollapse = ChevronDownMinor
                  if (!this.state.openGroup[index]) {
                    groupCollapse = ChevronUpMinor
                  }
                  const attributeTextField = (
                    <Autocomplete.TextField
                      onChange={this.updateAttributeText(index)}
                      label="Items"
                      value={inputAttributeValue}
                      prefix={<Icon source={SearchMinor} color="inkLighter" />}
                      placeholder="Search"
                    />
                  )
                  return (
                    <div className="group-card" key={`card` + index}>
                      <Card
                      title="Attribute"
                      sectioned
                      key={index}
                      >
                        <Stack>
                          <Stack.Item fill>
                            <TextField
                              value={group.label}
                              onChange={this.handleGroupLabel(index)}
                              placeholder="Attribute label"
                              connectedRight={
                                <Button icon={DeleteMajorMonotone} onClick={() => {this.removeGroup(index)}}></Button>
                              }
                            />
                          </Stack.Item>
                        </Stack>
                        <div className="group-tobble-button">
                          <Button icon={groupCollapse} plain size="slim" onClick={() => {this.toggleGroup(index)}}></Button>
                        </div>
                        <Collapsible open={this.state.openGroup[index]} id={'groupCol-' + index}>
                          <Card.Section>
                            <div className="attribute-item-header attribute-item pl-25 pb-15 mt-25 bb-grey" key={index}>
                              <div className="option-item">Option Title<br/>Stores</div>
                              <div className="option-item">Price</div>
                              <div className="option-item">Table Row</div>
                              <div className="option-item">Size (LxWxH)<br/>Weight</div>
                              <div className="option-item">Option SKU<br/>Vendor SKU</div>
                              <div className="option-item">Postal Code</div>
                            </div>
                            <ResourceList
                              resourceName={{singular: 'attribute', plural: 'attributes'}}
                              items={group.dattributes}
                              renderItem={this.renderItem(index)}
                            />
                          </Card.Section>
                          
                          {
                            this.state.newOptionShow[index] ?
                              <Card.Section>
                                <Autocomplete
                                  options={attributeOptions}
                                  selected={selectedAttributeOptions}
                                  onSelect={this.updateAttributeSelection(index)}
                                  textField={attributeTextField}
                                  key={index}
                                />
                              </Card.Section>
                              : null
                          }

                          <Card.Section>
                            <div className="align-right">
                              <Button primary onClick={() => {this.addOption(index)}}>Add option</Button>
                            </div>
                          </Card.Section>
                        </Collapsible>
                      </Card>
                    </div>
                  )
                })}
              </Layout.Section>
              <Layout.Section>
                <PageActions
                  primaryAction={primaryAction}
                  secondaryActions={secondaryActions}
                />
              </Layout.Section>
              {/* <VariantsPicker
                active={variantsModal}
                modalType={modalType}
                selecteds={selecteds}
                togglePicker={this.toggleVariantsPicker}
                handleChoice={this.handleVariantsChoice}
                onConfirm={this.setVariantsPicker}
              /> */}
              <ProductPicker
                active={productModal}
                productData={product}
                togglePicker={this.toggleProductPicker}
                handleChoice={this.handleProductChoice}
                onConfirm={this.setProductPicker}
              />
              <ExclusionPicker
                active={exclusionModal}
                selecteds={selectedExclusions.split(',')}
                attributeList={exclusionAttributeList}
                togglePicker={this.toggleExclusionPicker}
                onConfirm={this.setExclusionPicker}
              />
              <ConfirmModal
                active={confirmModal}
                confirming={confirming}
                title="Are you sure?"
                description="Do you really want to remove this record permanently?"
                onConfirm={this.deleteTemplate}
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
  loadVariant,
  loadProduct,
  loadTemplate,
  createTemplate,
  deleteTemplate,
  updateTemplate,
  // loadVariants,
  searchAttributes
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewTemplate)