import React, { Component, Fragment } from 'react'
import { Modal, Checkbox, List } from '@shopify/polaris'
import { connect } from 'react-redux'

class ExclusionPicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      active: false,
      selecteds: [],
      variants: []
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.active !== state.active) {
      const exclusions = props.selecteds.filter(sel => sel != "")
      
      return {
        loading: false,
        active: props.active,
        selecteds: exclusions,
        variants: props.variants
      }
    } else {
      return null
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
      loading: true
    })
    this.props.onConfirm({exclusionList: selecteds})
  }

  handleSelect = vid => {

    let { selecteds } = this.state
    const variantIndex = vid.split('/')[vid.split('/').length - 1]

    let index = selecteds.findIndex(sel => sel == variantIndex)
    if (index >= 0) {
      selecteds = selecteds.filter(sel => sel != variantIndex)
    } else {
      selecteds = [...selecteds, variantIndex]
    }
    this.setState({
      selecteds: selecteds
    })
  }

  render () {
    const { loading, active, variants, selecteds } = this.state
    const rows = variants.map(variant => {
      const variantId = variant.id.split('/')[variant.id.split('/').length - 1]
      return (
        <List.Item key={variantId}>
          
          <Checkbox
            checked={selecteds.includes(variantId)}
            label={variant.title}
            labelHidden={false}
            onChange={() => {
              this.handleSelect(variant.id)
            }}
          />
        </List.Item>
      )
    })
    return (
      <Modal
        open={active}
        title='Add exclusions'
        onClose={this.togglePicker}
        loading={loading}
        primaryAction={{
          content: 'Save',
          onAction: this.onConfirm
        }}
        large
      >
        <Modal.Section>
          <div className="exclusion-list">
            <List type="bullet">
              {rows}
            </List>
          </div>
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