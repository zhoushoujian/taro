/**
 * React Native 原生组件
 */
import { Component } from 'react'
import { WebView } from 'react-native'

export default class WebViewRN extends Component {
  render() {
    return (
      <WebView
        style={{ height: '100%' }}
        originWhitelist={['*']}
        source={{ uri: this.props.src }}
      />
    )
  }
}
