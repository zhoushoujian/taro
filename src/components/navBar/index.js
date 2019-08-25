import { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import Arrow from "./assets/back-arrow.png"
import "./index.scss";

export default class NavBar extends Component {

  render() {
    let { centerText="", backFun } = this.props;
    const isWeApp = process.env.TARO_ENV === 'weapp';
    return (
      <View>
        {!isWeApp && <View className="navbar-container">
          <View className="nav-back-area" onClick={backFun}>
            <Image className="nav-back-arrow" src={Arrow} ></Image>
          </View>
          <Text className="center-text">{centerText}</Text>
        </View>}
      </View>
    );
  }
}

