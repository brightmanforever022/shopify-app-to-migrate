import React, { Component, Fragment } from 'react'
import { Page, Layout, Card, Button, FormLayout, ButtonGroup } from '@shopify/polaris'

class Home extends Component {
  constructor(props) {
    super(props)
  }

  gotoTemplate = () => {
    this.props.history.push(`/templates`)
  }

  gotoAttribute = () => {
    this.props.history.push(`/attributes`)
	}
	
	gotoFreightoption = () => {
    this.props.history.push(`/freightoptions`)
  }

  render () {
    return (
			<Page>
				<Layout>
					<Layout.Section>
						<Card sectioned subdued>
							<FormLayout>
								<ButtonGroup fullWidth={true}>
									<Button primary={true} onClick={this.gotoTemplate}>Manage Templates</Button>
								</ButtonGroup>
								<ButtonGroup fullWidth={true}>
									<Button primary={true} onClick={this.gotoAttribute}>Manage Attributes</Button>
								</ButtonGroup>
								<ButtonGroup fullWidth={true}>
									<Button primary={true} onClick={this.gotoFreightoption}>Manage Freight Options</Button>
								</ButtonGroup>
							</FormLayout>
						</Card>
					</Layout.Section>
				</Layout>
			</Page>
    )
  }
}

export default Home