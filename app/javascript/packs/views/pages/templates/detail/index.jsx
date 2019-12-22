import React, { Component, Fragment } from 'react'
import { Page, Layout, PageActions, Card, Stack, TextStyle, Button, Thumbnail, TextContainer, FormLayout, TextField, ButtonGroup, Autocomplete, Icon } from '@shopify/polaris'
import { SearchMinor } from '@shopify/polaris-icons'
import { connect } from 'react-redux'
import ProductPicker from '../shared/product-picker'
import SkeletonLoader from '../../../components/skeleton-loader'

import ConfirmModal from '../../../components/confirm-modal'

import {
  loadVariant,
  loadVariants,
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
      modal: false,
      modalType: 'variant',
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
      newOptionShow: []
    }

    this.handlePriceType = this.handlePriceType.bind(this)
  }

  componentWillMount () {
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
              attribute_code: att.attibute_code ? att.attribute_code : ''
            }
          })
          var newOptionShow = []
          for (let i = 0; i < data.template.groups.length; i++) {
            newOptionShow[i] = false            
          }
          this.setState({
            variants: data.variants.data.nodes,
            groups: data.template.groups,
            label: data.template.label,
            loading: false,
            deselectedAttributeOptions: attributeList,
            newOptionShow: newOptionShow
          })
        }
      })
    }
  }

  openModal = modalType => {
    const { variants } = this.state
    const selecteds = variants.map(v => ({variant_id: this.convertId(v.id)}))
    this.setState({
      modal: true,
      modalType: modalType,
      selecteds: selecteds
    })
  }

  togglePicker = modal => {
    this.setState({modal})
  }

  setPicker = params => {
    this.setState({modal: false})
    if (params.selecteds.length < 1) {
      return false
    }
    if (this.state.modalType == 'product') {
      this.loadVariants(params.selecteds.map(selected => selected.variant_id))
    } else {
      this.loadVariant(params.selecteds[0].variant_id)
    }
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

  addGroup = () => {
    let { groups } = this.state
    let default_group = {
      label: '',
      is_required: false,
      dattributes: []
    }
    this.setState({
      groups: [...groups, default_group]
    })
  }

  removeGroup = index => {
    let { groups } = this.state
    this.setState({
      groups: groups.filter((group,i) => i !== +index)
    })
  }

  handleGroupLabel = index => value => {
    let { groups } = this.state
    groups[index].label = value
    this.setState({groups: groups})
  }

  addOption = index => {
    // let default_option = {
    //   label: '',
    //   price: 0,
    //   price_type: false,
    //   weight: 0,
    //   width: 0,
    //   length: 0,
    //   girth: 0,
    //   attribute_code: ''
    // }
    // let { groups } = this.state
    // groups[index].dattributes = [...groups[index].dattributes, default_option]
    // this.setState({groups: groups})
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

  handleChoice = selecteds => {
    this.setState({selecteds})
  }

  handleChange = property => value => {
    this.setState({[property]: value})
  }

  removeItem = (index, key) => {
    let {groups} = this.state
    let dattributes = groups[index].dattributes.filter((item, i) => i !== +key)
    groups[index].dattributes = dattributes
    this.setState({groups: groups})
  }

  handleSave = () => {
    const { variants, groups, id, label } = this.state
    if (variants.length < 1) {
      alert('No product assigned')
      return false
    }
    this.setState({saving: true})
    if (id) {
      this.props.updateTemplate({
        id,
        variants,
        groups,
        label,
        cb: data => {
          this.setState({saving: false})
        }
      })
    } else {
      this.props.createTemplate({
        label,
        variants,
        groups,
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
    // console.log('index: ', index)
    // console.log('value: ', value)
    this.setState({inputAttributeValue: value})
    
    if (value === '') {
      this.setState({attributeOptions: this.state.deselectedAttributeOptions})
      return
    }
    this.props.searchAttributes({
      searchText: value,
      cb: data => {
        // console.log('data: ', data)
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
            attribute_code: att.attibute_code ? att.attribute_code : ''
          }
        })
        this.setState({deselectedAttributeOptions: attributeList, attributeOptions: attributeList})
      }
    })
    // const filterRegex = new RegExp(value, 'i')
    // const resultOptions = this.state.deselectedAttributeOptions.filter((option) => {
    //   return option.label.match(filterRegex)
    // })
    // this.setState({attributeOptions: resultOptions})
  }

  updateAttributeSelection = index => selected => {
    // console.log('index: ', index)
    // console.log('selected: ', selected)
    const selectedValue = selected.map((selectedItem) => {
      const matchedOption = this.state.attributeOptions.find((option) => option.value.toString().match(selectedItem))
      return matchedOption
    })

    this.setState({selectedAttributeOptions: selected})
    this.setState({inputAttributeValue: selectedValue[0].label})
    // console.log('result: ', selectedValue)

    let newOption = {
      id: selectedValue[0].value,
      label: selectedValue[0].label,
      price: selectedValue[0].price,
      price_type: selectedValue[0].price_type,
      weight: selectedValue[0].weight,
      width: selectedValue[0].width,
      length: selectedValue[0].length,
      girth: selectedValue[0].girth,
      attribute_code: selectedValue[0].attribute_code
    }
    let { groups } = this.state
    groups[index].dattributes = [...groups[index].dattributes, newOption]

    var newOptionShow = this.state.newOptionShow
    newOptionShow[index] = false
    this.setState({groups: groups, newOptionShow: newOptionShow})
    // console.log('groups: ', this.state.groups)
  }

  render () {
    const { label, loading, modal, modalType, variants, groups, saving, id, confirmModal, confirming, selecteds, inputAttributeValue, attributeOptions, selectedAttributeOptions } = this.state
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
                    if (variants.length > 0) {
                      return (variants.map(node => {
                        return (
                          <FormLayout
                            key={node.id}
                          >
                            <Stack
                              key={node.id}
                            >
                              <Stack.Item>
                                <Thumbnail
                                  size="medium"
                                  source={node.image ? node.image.src : node.product.featuredImage ? node.product.featuredImage.transformedSrc : 'https://cdn.shopify.com/s/images/admin/no-image-compact.gif'}
                                />
                              </Stack.Item>
                              <Stack.Item fill>
                                <TextContainer spacing="tight">
                                  <p>{node.product.title}</p>
                                  <p>{node.title}</p>
                                  <p>{node.sku}</p>
                                </TextContainer>
                              </Stack.Item>
                              <Stack>
                                <p>
                                  ${node.price}
                                </p>
                              </Stack>
                            </Stack>
                            <hr/>
                          </FormLayout>
                          )
                      }))
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
                      {/* <div className="mt-25"> */}
                        <ButtonGroup>
                          <Button primary onClick={() => {this.addGroup}}>New add-on</Button>
                          <Button primary external={true} url="/attributes/new">New Attribute</Button>
                          <Button
                            onClick={() => {this.openModal('product')}}
                          >
                            Assign variants
                          </Button>
                        </ButtonGroup>
                      {/* </div> */}
                    </Stack.Item>
                  </Stack>
                </Card>
              </Layout.Section>
              <Layout.Section>
                <Card
                  title="Add-ons management"
                  actions={[{
                    content: 'Add add-on',
                    onAction: this.addGroup
                  }]}
                  sectioned
                >
                  {groups.map((group, index) => {
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
                      <Card.Section
                        key={index}
                      >
                        <Stack>
                          <Stack.Item fill>
                            <TextField
                              value={group.label}
                              onChange={this.handleGroupLabel(index)}
                              label="Add-on label"
                            />
                          </Stack.Item>
                          <Stack.Item>
                            <div className="mt-25">
                              <ButtonGroup>
                                <Button onClick={() => {this.removeGroup(index)}}>Remove</Button>
                              </ButtonGroup>
                            </div>
                          </Stack.Item>
                        </Stack>
                        <Card.Subsection>
                        {
                          group.dattributes.length > 0 && group.dattributes.filter(attribute => attribute.label != '').map((item, key) => {
                            return (
                              <Fragment
                                key={key}
                              >
                                <FormLayout.Group condensed>
                                  <TextField
                                    value={item.label}
                                    onChange={this.handleItem('label', index, key)}
                                    label="Option label"
                                  />
                                  <TextField
                                    value={item.price}
                                    onChange={this.handleItem('price', index, key)}
                                    label="Price"
                                    prefix="$"
                                    type="number"
                                    min="0"
                                  />
                                  <label>
                                    Upcharge Type<br/>
                                    <select value={item.price_type} onChange={this.handlePriceType(index, key)} className="select-type">
                                      <option value="false">Add On</option>
                                      <option value="true">Percent</option>
                                    </select>
                                  </label>
                                  <TextField
                                    value={item.weight}
                                    onChange={this.handleItem('weight', index, key)}
                                    label="Weight"
                                    type="number"
                                    min="0"
                                  />
                                  <TextField
                                    value={item.width}
                                    onChange={this.handleItem('width', index, key)}
                                    label="Width"
                                    type="number"
                                    min="0"
                                  />
                                  <TextField
                                    value={item.length}
                                    onChange={this.handleItem('length', index, key)}
                                    label="Length"
                                    type="number"
                                    min="0"
                                  />
                                  <TextField
                                    value={item.girth}
                                    onChange={this.handleItem('girth', index, key)}
                                    label="Girth"
                                    type="number"
                                    min="0"
                                  />
                                  <TextField
                                    value={item.attribute_code}
                                    onChange={this.handleItem('attribute_code', index, key)}
                                    label="Attribute Code"
                                  />
                                  <div className="action-btn mt-25">
                                    <ButtonGroup segmented>
                                      <Button primary>Add exclusions</Button>
                                      <Button external url={"/attributes/" + item.id + "/edit"}>Edit Attribute</Button>
                                      <Button onClick={() => {this.removeItem(index, key)}}>Remove</Button>
                                    </ButtonGroup>
                                  </div>
                                </FormLayout.Group>
                                
                              </Fragment>
                            )
                          })
                        }
                        </Card.Subsection>
                        
                        {
                          this.state.newOptionShow[index] ?
                            <Card.Subsection>
                                <Autocomplete
                                options={attributeOptions}
                                selected={selectedAttributeOptions}
                                onSelect={this.updateAttributeSelection(index)}
                                textField={attributeTextField}
                                key={index}
                              />
                            </Card.Subsection>
                            : null
                        }

                        <Card.Subsection>
                          <div className="align-right">
                            <Button primary onClick={() => {this.addOption(index)}}>Add option</Button>
                          </div>
                        </Card.Subsection>

                      </Card.Section>
                    )
                  })}
                </Card>
              </Layout.Section>
              <Layout.Section>
                <PageActions
                  primaryAction={primaryAction}
                  secondaryActions={secondaryActions}
                />
              </Layout.Section>
              <ProductPicker
                active={modal}
                modalType={modalType}
                selecteds={selecteds}
                togglePicker={this.togglePicker}
                handleChoice={this.handleChoice}
                onConfirm={this.setPicker}
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
  loadVariants,
  searchAttributes
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewTemplate)