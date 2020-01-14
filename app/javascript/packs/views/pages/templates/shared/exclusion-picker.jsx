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
    this.props.onConfirm({selecteds: selecteds})
  }

  handleSelect = vid => {

    let { selecteds } = this.state

    let index = selecteds.findIndex(sel => sel == vid)
    if (index >= 0) {
      selecteds = selecteds.filter(sel => sel != vid)
    } else {
      selecteds = [...selecteds, vid]
    }
    this.setState({
      selecteds: selecteds
    })
  }

  render () {
    const { loading, active, variants, selecteds } = this.state
    const rows = variants.map(variant => {
      return (
        <List.Item key={variant.id}>
          <Checkbox
            checked={selecteds.includes(variant.id)}
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
          onAction: this.onConfirm,
          disabled: selecteds.length === 0
        }}
        large
      >
        <Modal.Section>
          <List type="bullet" className="exclusion-list">
            {rows}
          </List>
          {/* <DataTable
            columnContentTypes={[
              'text',
              'text'
            ]}
            headings={[
              '#',
              'Title'
            ]}
            rows={rows}
          /> */}
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