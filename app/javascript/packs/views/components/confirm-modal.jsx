import React, { Component } from 'react'
import { Modal, TextContainer } from '@shopify/polaris'

class ConfirmModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false,
      confirming: false
    }
  }

  static getDerivedStateFromProps(props, state) {
    return {
      active: props.active,
      confirming: props.confirming
    }
  }

  toggleConfirm = () => {
    this.props.toggleConfirm(!this.state.active)
  }

  onConfirm = () => {
    this.props.onConfirm()
  }

  componentDidMount () {
    this.setState({
      active: this.props.active,
      confirming: this.props.confirming
    })
  }

  render () {
    const { active, confirming } = this.state
    const { title, description } = this.props
    return (
      <Modal
        open={active}
        onClose={this.toggleConfirm}
        title={title}
        primaryAction={{
          content: 'Ok',
          onAction: this.onConfirm,
          loading: confirming
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: this.toggleConfirm,
          },
        ]}
      >
        <Modal.Section>
          <TextContainer>
            <p>{description}</p>
          </TextContainer>
        </Modal.Section>
      </Modal>
    )
  }
}

export default ConfirmModal
