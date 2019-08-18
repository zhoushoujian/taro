import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import NavBar from "../../components/navBar"
import { HTTP_URL } from "../../constants/api"

class Privacy extends Component {

  componentDidMount(){
      window.axios.get(HTTP_URL.getPrivacy)
          .then((response) => {
              window.$("#privacy-statement .privacy-statement-content").html(response.data.result);
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
          <Text className="privacy-statement-content"></Text>
      </View>
    );
  }
}

export default Privacy;
