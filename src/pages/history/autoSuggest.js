import Taro, { Component } from '@tarojs/taro'
import { Text } from '@tarojs/components'

export default class AutoSuggest extends Component {

  render(){
    let { item, query, select } = this.props;
    let result;
    const index1 = item.indexOf(query)
    const index2 = query.length
    const string1 = item.slice(0, index1)
    const string2 = item.slice(index1, index1 + index2)
    const string3 = item.slice(index1 + index2)
    result = string1 + '<b>' + string2 + '</b>' + string3;
    return (
      <Text className="auto-suggest-name" onClick={() => select(item)} dangerouslySetInnerHTML={{ __html: result }}  />
    )
  }
}
