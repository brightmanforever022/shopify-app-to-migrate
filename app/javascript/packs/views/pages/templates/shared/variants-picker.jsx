import React, { Component, Fragment } from 'react'
import { Modal, DataTable, Filters, Pagination, Thumbnail, Checkbox, TextContainer, TextStyle, SkeletonBodyText } from '@shopify/polaris'
import { connect } from 'react-redux'

import {
  loadProducts
} from '../../../../api/product'

class VariantsPicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      active: false,
      queryValue: '',
      perPage: 10,
      cursor: '',
      direction: '',
      hasPrevious: false,
      hasPrevious: false,
      reloading: false,
      selecteds: [],
      queryType: 'product',
      records: []
    }
  }

  static getDerivedStateFromProps(props, state) {
    return {
      active: props.active,
      queryType: props.modalType,
      selecteds: props.selecteds
    }
  }

  componentDidMount () {
    this.setState({
      active: this.props.active
    })
  }

  initLoad = () => {
    this.setState({
      queryValue: null,
      cursor: '',
      direction: ''
    }, () => {
      this.loadProducts()
    })
  }

  loadProducts = () => {
    const { queryValue, cursor, direction, queryType } = this.state
    this.setState({
      reloading: true
    })
    loadProducts({
      queryValue,
      cursor,
      direction,
      queryType
    }).then(res => {
      this.setState({
        records: res.data.data.edges,
        hasPrevious: res.data.data.pageInfo.hasPreviousPage,
        hasNext: res.data.data.pageInfo.hasNextPage
      })
    }).catch(err => {
      console.log(err)
    }).then(() => {
      this.setState({
        loading: false,
        reloading: false
      })
    })
  }

  togglePicker = () => {
    this.props.togglePicker(!this.state.active)
  }

  onConfirm = () => {
    const {selecteds} = this.state
    this.setState({
      loading: true,
      reloading: true
    })
    this.props.onConfirm({selecteds: selecteds})
  }

  handleSelect = vid => {

    let variantId = vid.split('/')[vid.split('/').length - 1]
    let { selecteds, queryType } = this.state

    if (queryType === 'product') {
      let index = selecteds.findIndex(select => +select.variant_id === +variantId)
      if (index >= 0) {
        selecteds = selecteds.filter(select => +select.variant_id !== +variantId)
      } else {
        selecteds = [...selecteds, {variant_id: +variantId}]
      }
    } else {
      selecteds = [{variant_id: +variantId}]
    }
    this.props.handleChoice(selecteds)
  }

  handleChange = property => value => {
    this.setState({[property]: value}, () => {
      this.loadProducts()
    })
  }

  handleQueryClear = () => {
    this.setState({queryValue: ''})
  }

  handlePage = key => {
    let { records } = this.state
      let cursors = records.map(v => v.cursor)
      let cursor = key === 'next' ? cursors[cursors.length - 1] : cursors[0]
      this.setState({
        direction: key,
        cursor: cursor
      }, () =>{
        this.loadProducts()
      })
  }

  render () {
    const { loading, active, queryValue, hasNext, hasPrevious, records, reloading, selectedProduct, selectedVariant, queryType, selecteds } = this.state
    const rows = records.map(record => {
      const source = record.node.image ? record.node.image.src : record.node.product && record.node.product.featuredImage ? record.node.product.featuredImage.src : 'https://cdn.shopify.com/s/images/admin/no-image-compact.gif'
      const selectedVariants = selecteds.map(selected => `gid://shopify/ProductVariant/${selected.variant_id}`)
      return [
        <Checkbox
          checked={selectedVariants.includes(record.node.id)}
          label="Select"
          labelHidden={true}
          onChange={() => {
            this.handleSelect(record.node.id)
          }}
        />,
        <Thumbnail
          size="medium"
          source={source}
        />,
        <TextContainer spacing="tight">
          <p>{record.node.product && record.node.product.title}</p>
          <p>{record.node.title}</p>
          <p>{record.node.sku}</p>
        </TextContainer>,
        <p>${record.node.price}</p>,
        <TextStyle variation={record.node.inventoryQuantity >= 0 ? 'positive' : 'negative'}>
          {record.node.inventoryQuantity}
        </TextStyle>
      ]
    })
    return (
      <Modal
        open={active}
        title={`Select ${queryType == 'product' ? 'variants' : 'variant'}`}
        onClose={this.togglePicker}
        loading={loading}
        primaryAction={{
          content: 'Ok',
          onAction: this.onConfirm,
          disabled: selecteds.length === 0
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: this.togglePicker
          }
        ]}
        onTransitionEnd={this.initLoad}
        footer={
          <Pagination
            hasNext={hasNext}
            hasPrevious={hasPrevious}
            onPrevious={() => {this.handlePage('prev')}}
            onNext={() => {this.handlePage('next')}}
          />
        }
        large
      >
        <Modal.Section>
          <Filters
            filters={[]}
            queryValue={queryValue}
            onQueryChange={this.handleChange('queryValue')}
            onQueryClear={this.handleQueryClear}
          />
          {reloading && <div className="mt-25"><SkeletonBodyText/></div>}
          {
            !reloading &&
            <DataTable
              columnContentTypes={[
                'text',
                'text',
                'text',
                'numeric',
                'numeric',
              ]}
              headings={[
                '#',
                'Thumbnail',
                'Product',
                'Price',
                'Stock',
              ]}
              rows={rows}
            />
          }
        </Modal.Section>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = {
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VariantsPicker)