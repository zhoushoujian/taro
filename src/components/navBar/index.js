import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import Arrow from "./assets/back-arrow.png"
import "./index.scss";

class NavBar extends Component {

  render() {
    let { centerText="", backFun } = this.props;
    return (
        <View>
            <View className="navbar-container">
              <Image className="nav-back-arrow" src={Arrow} onClick={backFun}></Image>
              <Text className="center-text">{centerText}</Text>
            </View>
        </View>
    );
  }
}

export default NavBar;
