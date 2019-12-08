import React, {Component} from 'react'
import { SkeletonPage, Layout, Card, TextContainer, SkeletonDisplayText, SkeletonBodyText } from '@shopify/polaris'

class SkeletonLoader extends Component {
  render () {
    return (
      <SkeletonPage>
        <Layout>
          <Layout.Section>
            {(() => {
              var loaders = []
              for (var i = 0; i < this.props.level; i++) {
                loaders.push(
                  <Card
                    sectioned
                    key={i}
                  >
                    <TextContainer>
                      <SkeletonDisplayText size="small"/>
                      <SkeletonBodyText/>
                    </TextContainer>
                  </Card>
                )
              }
              return loaders
            })()}
          </Layout.Section>
        </Layout>
      </SkeletonPage>
    )
  }
}

export default SkeletonLoader
