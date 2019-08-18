import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import NavBar from "../../components/navBar"
import { HTTP_URL } from "../../constants/api";

class UserAgreement extends Component {

  componentDidMount(){
      window.axios.get(HTTP_URL.getUserAgreement)
          .then((response) => {
              window.$("#user-agreement .user-agreement-content").html(response.data.result);
          })
  }

  goBack = () => {
    Taro.navigateTo({
      url: '/pages/about/about'
    })
  }

  render() {
    return (
      <View id="user-agreement">
        <NavBar centerText="用户协议" backFun={this.goBack}></NavBar>
        <Text className="user-agreement-content"></Text>
      </View>
    );
  }
}

export default UserAgreement;
