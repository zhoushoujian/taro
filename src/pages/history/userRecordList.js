import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

export default class UserRecordList extends Component {
  render() {
    const { item } = this.props;
    return (
      <View className="record-container">
          <Text className="date-record">{item.date}</Text>
          <Text className="location-record">{item.location}</Text>
      </View>
    )
  }
}
