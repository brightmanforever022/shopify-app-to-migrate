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
      dattributes: []
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.active !== state.active) {
      const exclusions = props.selecteds.filter(sel => sel != "")
      
      return {
        loading: false,
        active: props.active,
        selecteds: exclusions,
        dattributes: props.attributeList
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

  handleSelect = daid => {
    const id = daid.toString()
    let { selecteds } = this.state
    let index = selecteds.findIndex(sel => sel == id)
    if (index >= 0) {
      selecteds = selecteds.filter(sel => sel != id)
    } else {
      selecteds = [...selecteds, id]
    }
    this.setState({
      selecteds: selecteds
    })
  }

  render () {
    const { loading, active, dattributes, selecteds } = this.state
    const rows = dattributes.map(dattribute => {
      return (
        <List.Item key={dattribute.id}>
          <Checkbox
            checked={selecteds.includes(dattribute.id.toString())}
            label={dattribute.label}
            labelHidden={false}
            onChange={() => {
              this.handleSelect(dattribute.id)
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