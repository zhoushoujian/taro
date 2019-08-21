import Taro, { Component } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { HTTP_URL } from "../../constants/api";
// import { networkErr } from "../../services/utils";
import "taro-ui/dist/style/components/button.scss";

class UpdateUserInfoComponent extends Component {

    backToMainPage = () => {
        window.goRoute(this, "user_profile");
    }

    saveUserInfo = () => {
        let {infoLength, infoErrorTip, updateUserInfoDispatch, pageTitle, name, backToMainPage, gotoLoginPage} = this.props;
        let value = window.$(".set-user-info-component-content input")[0].value;
        if(value.length > infoLength) {
            return alert(infoErrorTip)
        } else if(!value){
            return;
        } else if (pageTitle === "填写手机号"){
            if(!/^[1]([3-9])[0-9]{9}$/g.test(value.replace(/\s/g, ""))){
                return alert(infoErrorTip)
            }
        }
        let {username, token} = window.$getState().login;
        if(!token && gotoLoginPage) {
            return gotoLoginPage()
        }
        let data = Object.assign({}, {username, token, userInfo: { [name]: value } })
        window.axios.post(HTTP_URL.updateUserInfo, data)
            .then((response) => {
                if(response.data.result === "modify_success"){
                    Toast.success('保存成功', CON.toastTime);
                    window.$dispatch(updateUserInfoDispatch(value));
                    backToMainPage()
                } else {
                    Toast.fail('设置失败', CON.toastTime);
                }
            })
            .catch(err => {
                // logger.error('saveUserInfo  err', err.stack || err.toString());
                return networkErr(err);
            })
    }

    keyDownEvent = (e) => {
        if (e.keyCode === 13) {
            window.$(".set-user-info-component-content input")[0].blur()
            return this.saveUserInfo();
        }
    }

    render() {
        let {placeholder} = this.props;
        return (
            <View className="set-user-info-component-container">
                <View className="set-user-info-component-content">
                    <Input className="set-user-info-input" placeholder={placeholder} onKeyDown={this.keyDownEvent}/>
                    <View className="save-user-info">
                        <AtButton type="primary" className="button" value="保存" onClick={this.saveUserInfo}>保存</AtButton>
                    </View>
                </View>
            </View>
        );
    }
}

export default UpdateUserInfoComponent;
