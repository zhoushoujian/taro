import { HTTP_URL } from "../../constants/api";
import Taro, { Component } from '@tarojs/taro'
import NavBar from "../../components/navBar"
import { View, Text } from '@tarojs/components'

class ServiceList extends Component {

  config = {
    navigationBarTitleText: '服务条款'
  }

  componentDidMount() {
    window.axios.get(HTTP_URL.getServiceList)
      .then((response) => {
        window.$("#service-list .service-list-content").html(response.data.result);
      })
  }

  goBack = () => {
    Taro.navigateTo({
      url: '/pages/about/about'
    })
  }

  render() {
    return (
      <View id="service-list">
        <NavBar centerText="服务条款" backFun={this.goBack}></NavBar>
        <Text className="service-list-content"></Text>
      </View>
    );
  }
}

export default ServiceList;
