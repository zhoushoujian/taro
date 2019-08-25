import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { HTTP_URL } from "../../constants/api";
import NavBar from "../../components/navBar"
import { networkErr, fetch } from "../../utils/utils"

class ServiceList extends Component {

  config = {
    navigationBarTitleText: '服务条款'
  }

  constructor(props){
    super(props);
    this.state = {
      result: ""
    }
  }

  componentDidMount() {
    const self = this;
    fetch(HTTP_URL.getServiceList)
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
      <View id="service-list">
        <NavBar centerText="服务条款" backFun={this.goBack}></NavBar>
        <Text className="service-list-content" dangerouslySetInnerHTML={{ __html: this.state.result }}></Text>
      </View>
    );
  }
}

export default ServiceList;
