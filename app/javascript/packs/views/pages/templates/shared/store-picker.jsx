import React, { Component } from 'react'
import { Modal, Checkbox, List } from '@shopify/polaris'
import { connect } from 'react-redux'

class StorePicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      active: false,
      selecteds: [],
      store_list: []
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.active !== state.active) {
      const stores = props.selecteds.filter(sel => sel != "")
      
      return {
        loading: false,
        active: props.active,
        selecteds: stores,
        store_list: props.storeList
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
    this.props.onConfirm({selectedStores: selecteds})
  }

  handleSelect = storeName => {
    let { selecteds } = this.state
    let index = selecteds.findIndex(sel => sel == storeName)
    if (index >= 0) {
      selecteds = selecteds.filter(sel => sel != storeName)
    } else {
      selecteds = [...selecteds, storeName]
    }
    this.setState({
      selecteds: selecteds
    })
  }

  render () {
    const { loading, active, store_list, selecteds } = this.state
    const rows = store_list.map(st => {
      return (
        <List.Item key={st.id}>
          <Checkbox
            checked={selecteds.includes(st.shopify_domain)}
            label={st.shopify_domain}
            labelHidden={false}
            onChange={() => {
              this.handleSelect(st.shopify_domain)
            }}
          />
        </List.Item>
      )
    })
    return (
      <Modal
        open={active}
        title='Add Store names'
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
)(StorePicker)