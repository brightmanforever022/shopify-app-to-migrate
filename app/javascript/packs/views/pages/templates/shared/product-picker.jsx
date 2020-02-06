import React, { Component, Fragment } from 'react'
import { Modal, DataTable, Filters, Pagination, Thumbnail, Checkbox, RadioButton, TextContainer, TextStyle, SkeletonBodyText } from '@shopify/polaris'
import { SearchMinor } from '@shopify/polaris-icons'
import CurrencyFormat from 'react-currency-format'
import { connect } from 'react-redux'

import {
  loadProducts
} from '../../../../api/product'

class ProductPicker extends Component {
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
      product: {},
      records: []
    }
  }

  static getDerivedStateFromProps(props, state) {
    return {
      active: props.active,
      product: props.productData
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
    const { queryValue, cursor, direction } = this.state
    this.setState({
      reloading: true
    })
    loadProducts({
      queryValue,
      cursor,
      direction
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
    const {product} = this.state
    this.setState({
      loading: true,
      reloading: true
    })
    this.props.onConfirm({product: product})
  }

  handleSelect = product => {
    console.log('selected product data: ', product)
    this.props.handleChoice(product)
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
    const { loading, active, queryValue, hasNext, hasPrevious, records, reloading, product } = this.state
    const productId = product ? product.id : 0
    const rows = records.map(record => {
      const source = record.node.featuredImage ? record.node.featuredImage.transformedSrc : 'https://cdn.shopify.com/s/images/admin/no-image-compact.gif'
      return [
        <RadioButton
          checked={productId == record.node.id}
          label="Select Product"
          labelHidden={true}
          onChange={() => {
            this.handleSelect(record.node)
          }}
        />,
        <Thumbnail
          size="medium"
          source={source}
        />,
        <TextContainer spacing="tight">
          <p>{record.node.title}</p>
        </TextContainer>,
        <TextStyle variation={record.node.totalInventory >= 0 ? 'positive' : 'negative'}>
          {record.node.totalInventory}
        </TextStyle>
      ]
    })
    return (
      <Modal
        open={active}
        title={`Select Product`}
        onClose={this.togglePicker}
        loading={loading}
        primaryAction={{
          content: 'Ok',
          onAction: this.onConfirm,
          disabled: !product
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
                'numeric'
              ]}
              headings={[
                '#',
                'Thumbnail',
                'Product',
                'Inventory'
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
)(ProductPicker)