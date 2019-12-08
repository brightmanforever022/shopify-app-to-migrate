import React, { Component, Fragment } from 'react'
import { Toast } from '@shopify/polaris'
import { connect } from 'react-redux'
import {
  toggleToast
} from '../../actions/toast'

class Toaster extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  toggleToast = () => {
    this.props.toggleToast({
      isOpen: false
    })
  }

  render() {
    const { isOpen, message, error } = this.props
    const toastMarkup = isOpen ? <Toast error={error} content={message} onDismiss={this.toggleToast} /> : null
    return (
      <Fragment>
        {toastMarkup}
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  isOpen: state.toast.isOpen,
  message: state.toast.message,
  error: state.toast.error
})

const mapDispatchToProps = {
  toggleToast
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Toaster)