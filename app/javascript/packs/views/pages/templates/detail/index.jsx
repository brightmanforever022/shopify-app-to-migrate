import React, { Component, Fragment } from 'react'
import { Page, Layout, PageActions, Card, Stack, TextStyle, Button, Thumbnail, TextContainer, FormLayout, TextField, ButtonGroup } from '@shopify/polaris'
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

class NewTemplate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      modal: false,
      modalType: 'variant',
      product: null,
      lable: '',
      id: null,
      variants: [],
      groups: [],
      index: 0,
      key: 0,
      saving: false,
      confirming: false,
      confirmModal: false,
      selecteds: []
    }
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
          this.setState({
            variants: data.variants.data.nodes,
            groups: data.template.groups,
            label: data.template.label,
            loading: false
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
        groups[index].items[key].shopify_variant_id = id
        groups[index].items[key].price = Number(data.data.price)
        groups[index].items[key].shopify_variant_title = data.data.displayName
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
      items: []
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
    let default_option = {
      label: '',
      price: 0,
      quantity: 1,
      shopify_variant_id: null,
      shopify_variant_title: null
    }
    let { groups } = this.state
    groups[index].items = [...groups[index].items, default_option]
    this.setState({groups: groups})
  }

  handleItem = (property, index, key) => value => {
    let { groups } = this.state
    groups[index].items[key][property] = value
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
    let items = groups[index].items.filter((item, i) => i !== +key)
    groups[index].items = items
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

  assignVariant = (index, key) => {
    const { groups } = this.state
    let variant_id = groups[index].items[key].shopify_variant_id
    const selecteds = variant_id ? [variant_id] : []
    this.setState({
      index,
      key,
      modalType: 'variant',
      selecteds: selecteds,
      modal: true
    })
  }

  convertId = graphId => {
    return Number(graphId.split('/')[graphId.split('/').length - 1])
  }

  render () {
    const { label, loading, modal, productVariant, modalType, variants, groups, saving, id, confirmModal, confirming, selecteds } = this.state
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
                      <Button
                        onClick={() => {this.openModal('product')}}
                      >
                        Assign variants
                      </Button>
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
                                <Button onClick={() => {this.addOption(index)}}>Add option</Button>
                              </ButtonGroup>
                            </div>
                          </Stack.Item>
                        </Stack>
                        <Card.Subsection>
                        {
                          group.items.length > 0 && group.items.map((item, key) => {
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
                                  <TextField
                                    value={item.quantity}
                                    onChange={this.handleItem('quantity', index, key)}
                                    label="Quantity"
                                    type="number"
                                    min="1"
                                  />
                                  <div className="action-btn mt-25">
                                    <ButtonGroup segmented>
                                      <Button onClick={() => {this.assignVariant(index, key)}}>Add variant</Button>
                                      <Button onClick={() => {this.removeItem(index, key)}}>Remove</Button>
                                    </ButtonGroup>
                                  </div>
                                </FormLayout.Group>
                                <TextStyle
                                  variation={item.shopify_variant_title ? '' : 'subdued'}
                                >
                                  <p className="ml-25 mt-5">{item.shopify_variant_title ? item.shopify_variant_title : 'No variant is assigned'}</p>
                                </TextStyle>
                              </Fragment>
                            )
                          })
                        }
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
  loadVariants
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewTemplate)