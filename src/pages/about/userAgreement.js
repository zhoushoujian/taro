import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import NavBar from "../../components/navBar"
import { HTTP_URL } from "../../constants/api";
import { networkErr, fetch } from "../../utils/utils"

class UserAgreement extends Component {

  config = {
    navigationBarTitleText: '用户协议'
  }

  constructor(props){
    super(props);
    this.state = {
      result: ""
    }
  }

  componentDidMount() {
    const self = this;
    fetch(HTTP_URL.getUserAgreement)
      .then((response) => {
        self.setState({
          result: response.data.result
        })
      })
      .catch(err => {
        networkErr(err)
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
        <Text className="user-agreement-content" dangerouslySetInnerHTML={{ __html: this.state.result }}></Text>
      </View>
    );
  }
}

export default UserAgreement;
