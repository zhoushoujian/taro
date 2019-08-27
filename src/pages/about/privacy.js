import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import NavBar from "../../components/navBar"
import { HTTP_URL } from "../../constants/api"
import { networkErr, fetch } from "../../utils/utils"


class Privacy extends Component {

  config = {
    navigationBarTitleText: '隐私条款'
  }

  constructor(props){
    super(props);
    this.state = {
      result: ""
    }
  }

  componentDidMount() {
    const self = this;
    fetch(HTTP_URL.getPrivacy)
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
      <View id="privacy-statement">
        <NavBar centerText="隐私条款" backFun={this.goBack}></NavBar>
          <Text className="privacy-statement-content"  dangerouslySetInnerHTML={{ __html: this.state.result }}></Text>
      </View>
    );
  }
}

export default Privacy;
