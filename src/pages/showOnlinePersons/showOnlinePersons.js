import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import NavBar from "../../components/navBar"
import { updateOnlinePersonsName } from "../../store/home"
import { HTTP_URL } from "../../constants/api";
import { networkErr, fetch } from "../../utils/utils"
import './index.scss'

@connect(state => state.home, { updateOnlinePersonsName })
export default class ShowOnlinePersons extends Component {

	constructor(props){
		super(props)
		this.state={
			onlinePersonsName: this.props.onlinePersonsName || [],
			isSearching: true
		}
	}

  componentDidMount() {
    return fetch(HTTP_URL.getOnlinePersons)
      .then(response => {
        let result = response.data.result;
        this.setState({
          onlinePersonsName: result
        })
        this.props.updateOnlinePersonsName(result)
        this.setState({
          isSearching: false
        })
      })
      .catch(function (error) {
        networkErr(error);
        this.setState({
          isSearching: false
        })
      })
  }

  backToMainPage = () => {
    Taro.navigateTo({
      url: '/pages/home/home'
    })
  }

  render() {
  const { onlinePersonsName, isSearching } = this.state
    return (
      <View className="online-persons-name-container">
        <NavBar centerText="在线成员" backToPreviousPage={this.backToMainPage} />
        <View className="online-persons-name-content">
		  	  {isSearching
		  	    ? <Text className="searching">正在查询...</Text>
		  	    : onlinePersonsName.map((item, index) => <Text key={item.username} className={item.origin || 'h5'}>{item.username + (index === onlinePersonsName.length-1 ? "" : `, `)}</Text>)}
		    </View>
      </View>
    );
  }
}
