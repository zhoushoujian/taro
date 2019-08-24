import { HTTP_URL } from "../../constants/api";
import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import NavBar from "../../components/navBar"
import PackageLists from "../../components/packageLists";

class Licence extends Component {

  config = {
    navigationBarTitleText: '开源声明'
  }

  constructor(props) {
    super(props);
    this.state = {
      packageList: []
    }
  }

  componentDidMount() {
    window.axios.get(HTTP_URL.getLicence)
      .then((response) => {
        this.setState({
          packageList: response.data.result.licence
        })
      })
  }

  goBack = () => {
    Taro.navigateTo({
      url: '/pages/about/about'
    })
  }

  render() {
    const { packageList } = this.state;
    return (
      <View id="licence-id">
        <NavBar centerText="开源声明" backFun={this.goBack}></NavBar>
          <ScrollView className="licence-content">
            <View className="header">
              <Text className='header-item1'>名称</Text>
              <Text className='header-item2'>许可证</Text>
              <Text className='header-item3'>经过修改</Text>
            </View>
            {packageList.map((item, index) => <PackageLists key={index} name={item.name} src={item.src} licence={item.licence} modified={item.modified} gotoChildPackage={this.gotoChildPackage}/>)}
            <View className="licence-footer"><Text>______________</Text>我是有底线的<Text>______________</Text></View>
          </ScrollView>
      </View>
    );
  }
}

export default Licence
