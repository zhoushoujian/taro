import Taro, { Component } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { HTTP_URL } from "../../constants/api";
import { networkErr, fetch } from "../../utils/utils"
import "taro-ui/dist/style/components/button.scss";
import "./index.scss"

class UpdateUserInfoComponent extends Component {

  constructor(props){
    super(props)
    this.state = {
      inputText: ""
    }
  }

  saveUserInfo = () => {
    const { inputText } = this.state;
    let {infoLength, infoErrorTip, updateUserInfoDispatch, name, backToMainPage, username, token} = this.props;
    let value = inputText;
    if(value.length > infoLength) {
      return Taro.showToast({
        title: infoErrorTip,
        icon: 'none',
        duration: 2000
      })
    } else if(!value){
      return;
    }
    if(!token) {
      Taro.navigateTo({
        url: '/pages/login/login'
      })
    }
    let data = Object.assign({}, {username, token, userInfo: { [name]: value } })
    return fetch(HTTP_URL.updateUserInfo, data, 'post')
      .then((response) => {
        if(response.data.result === "modify_success"){
          Taro.showToast({
            title: "保存成功",
            icon: 'none',
            duration: 2000
          })
          updateUserInfoDispatch(value);
        } else {
          Taro.showToast({
            title: "设置失败",
            icon: 'none',
            duration: 2000
          })

        }
      })
      .catch(err => {
        return networkErr(err);
      })
  }

  keyDownEvent = (e) => {
    if (e.keyCode === 13) {
      document.querySelector(".set-user-info-component-content input")[0].blur()
      return this.saveUserInfo();
    }
  }

  type = (e) => {
    this.setState({
      inputText: e.target.value
    })
  }

  render() {
    let { inputText } = this.state;
    let {placeholder} = this.props;
    return (
      <View className="set-user-info-component-container">
        <View className="set-user-info-component-content">
          <Input className="set-user-info-input" placeholder={placeholder} onKeyDown={this.keyDownEvent} value={inputText} onChange={this.type} />
          <View className="save-user-info">
            <AtButton type="primary" className="button" value="保存" onClick={this.saveUserInfo}>保存</AtButton>
          </View>
        </View>
      </View>
    );
  }
}

export default UpdateUserInfoComponent;
