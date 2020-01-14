import React, { Component, Fragment } from 'react'
import { Modal, Checkbox, TextContainer, TextStyle, SkeletonBodyText } from '@shopify/polaris'
import { connect } from 'react-redux'

class ExclusionPicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      active: false,
      reloading: false,
      selecteds: [],
      records: []
    }
  }

  static getDerivedStateFromProps(props, state) {
    return {
      active: props.active,
      selecteds: props.selecteds,
      variants: props.variants
    }
  }

  componentDidMount () {
    this.setState({
      active: this.props.active
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
    let { selecteds } = this.state

    let index = selecteds.findIndex(select => +select.variant_id === +variantId)
    if (index >= 0) {
      selecteds = selecteds.filter(select => +select.variant_id !== +variantId)
    } else {
      selecteds = [...selecteds, {variant_id: +variantId}]
    }
    
    this.props.handleChoice(selecteds)
  }

  render () {
    const { loading, active, records, reloading, selecteds } = this.state
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
        large
      >
        <Modal.Section>
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
)(ExclusionPicker)