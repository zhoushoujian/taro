import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

class PackageLists extends Component {

    render() {
        let { name, licence, modified } = this.props;
        return (
            <View className="licence-line">
                <Text className='licence-row1'>{name}</Text>
                <Text className='licence-row2'>{licence}</Text>
                <Text className='licence-row3'>{modified}</Text>
            </View>
        )
    }
}

export default PackageLists;
