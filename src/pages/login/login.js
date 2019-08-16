import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "antd-mobile";
import { loginApp, registerUsername, resetPasswordFunc} from "../logic/login";
import NavBar from "./child/navbar";
import { onBackKeyDown } from "../services/utils";
import { CON } from "../constants/enumeration";

class Login extends Component {

    constructor(props){
        super(props);
        this.state = {
          usernamePlaceholder: "请输入用户名",
			    passwordPlaceholder: "请输入密码",
			    username: "",
			    password: "",
			    showAsPassword: "password"
        }
    }

    componentDidMount(){
        document.removeEventListener("backbutton", onBackKeyDown, false);
        document.addEventListener("deviceready", this.listenBackButton, false);
		    const { username, password } = window.$getState().login;
		    this.setState({
		    	username,
		    	password
		    })
    }

    componentWillUnmount(){
        if(window.isCordova){
            StatusBar.overlaysWebView(false);
        }
        document.removeEventListener("deviceready", this.listenBackButton);
        document.removeEventListener("backbutton", this.backToMain);
    }

    listenBackButton = () => {
        StatusBar.overlaysWebView(true);
        document.addEventListener("backbutton", this.backToMain, false)
    }

    keyDownEvent = (evt) => {
        var e = evt;
        if (e.keyCode === 13) {
            window.$('#login-username').blur();
            window.$('#login-password').blur();
            this.login();
        }
    }

    login = () => {
        loginApp(this);
    }

    backToMain = () => {
        window.goRoute(this, "/main/sign")
    }

    focus = (elem) => {
        if(elem === 'username'){
			if(this.state.username) $("i.fa-times-circle-o").fadeIn()
            this.setState({
                usernamePlaceholder: ""
			});
        } else {
			if(this.state.password) $("i.fa-eye").fadeIn()
            this.setState({
                passwordPlaceholder: ""
			});
        }
    }

    blur = (elem) => {
        if(elem === 'username'){
            this.setState({
                usernamePlaceholder: "请输入用户名"
			});
			// $("i.fa-times-circle-o").fadeOut()
        } else {
            this.setState({
                passwordPlaceholder: "请输入密码"
			});
			// $("i.fa-eye").fadeOut()
        }
	}

	setUsername = (e) => {
		let username = ""
		if(e) username = e.target.value;
		if(username){
			$("i.fa-times-circle-o").fadeIn()
		}
		this.setState({
			username
		}, () => {
			if(!e){
				$("#login-username").click();
				$("i.fa-times-circle-o").fadeOut()
			}
		})
	}

	setPassword = (e) => {
		if(e.target.value){
			$("i.fa-eye").fadeIn()
		}
		this.setState({
			password: e.target.value || ""
		})
	}

	showOrHidePassword = () => {
		if(this.state.showAsPassword === "password"){
			this.setState({
				showAsPassword: "text"
			}, () => {
				$("i.fa-eye").css("color", "#fff")
			})
		} else {
			this.setState({
				showAsPassword: "password"
			}, () => {
				$("i.fa-eye").css("color", "#000")
			})
		}
	}

    render() {
        let { usernamePlaceholder, passwordPlaceholder, username, password, showAsPassword } = this.state;
        return (
            <div className="first-page">
                <div className="pic-blur"></div>
                <div className="top">
                    <div className="sign-text">签到</div>
                    <div className="record-life">记录生活每一天</div>
                </div>
                <div className="index">
                    <div className="head">欢迎登录觅星峰</div>
                    <div className="main">
                        <div className="input-content">
                            <div className="content">
                                <input type="text" id="login-username" name="username" placeholder={usernamePlaceholder} className="form" size="26" value={username}
									onKeyDown={(event) => this.keyDownEvent(event)} onFocus={() => this.focus("username")} onBlur={() => this.blur("username")}
									onChange={this.setUsername} autoComplete="off"/>
                                <div className="login-center-input-text">用户名</div>
								<i className="fa fa-times-circle-o" onClick={() => this.setUsername()}></i>
                            </div>
                        </div>
                        <div className="input-content">
                            <div className="content">
                                <input name="password" id="login-password" type={showAsPassword} placeholder={passwordPlaceholder} className="form" value={password}
                                    onKeyDown={(event) => this.keyDownEvent(event)} onFocus={() => this.focus("password")} onBlur={() => this.blur("password")}
									onChange={this.setPassword}/>
                                <div className="login-center-input-text">密码</div>
								<i className="fa fa-eye" onClick={this.showOrHidePassword} ></i>
                            </div>
                        </div>
                        <div className="login-btn">
                            <Button type="primary" className="button" id="loginButton" value="登录" onClick={this.login}>登录</Button>
                        </div>
                    </div>
                    <div className="foot">
                        <Link to="/register">
                            注册用户名
                        </Link>
                        <Link to="/reset_password">
                            重置密码
                        </Link>
                    </div>
                </div>
                <div className="back-btn" >
                    <Link to="/main/sign">
                        返回
                    </Link>
                </div>
             </div>
        );
    }
}

class Register extends Component {

    componentDidMount(){
        document.removeEventListener("backbutton", onBackKeyDown, false);
        document.addEventListener("deviceready", this.listenBackButton, false);
    }

    componentWillUnmount(){
        document.removeEventListener("deviceready", this.listenBackButton);
        document.removeEventListener("backbutton", this.backToMain);
    }

    listenBackButton = () => {
        setTimeout(() => {
            StatusBar.backgroundColorByHexString(CON.statusBarColor);
        }, 200)
        document.addEventListener("backbutton", this.backToMain, false)
    }

    backToMain = () => {
        window.goRoute(this, "/login")
    }

    registerKeyDownEvent = (evt) => {
        var e = evt;
        if (e.keyCode === 13) {
            window.$('#register-username').blur();
            window.$('#register-password1').blur();
            window.$('#register-password2').blur();
            this.register();
        }
    }

    register = () => {
        registerUsername(this);
    }

    render() {
        return (
            <div className="register-area">
                <NavBar centerText="注册新用户">
                    <div className="back-btn" onClick={this.backToMain}>
                        <i className="fa fa-angle-left"></i>
                    </div>
                </NavBar>
                <div className="input-content">
                    <div className="content">
                        <input type="text" id="register-username" name="register-username" placeholder="请输入用户名" className="form" size="26" onKeyDown={(event) => this.registerKeyDownEvent(event)} />
                    </div>
                </div>
                <div className="input-content">
                    <div className="content">
                        <input name="register-password" id="register-password1" type="password" placeholder="请输入密码，至少包含一个数字和字母" className="form" onKeyDown={(event) => this.registerKeyDownEvent(event)} />
                    </div>
                </div>
                <div className="input-content">
                    <div className="content">
                        <input name="register-password-again" id="register-password2" type="password" placeholder="请再次输入密码，至少包含一个数字和字母" className="form" onKeyDown={(event) => this.registerKeyDownEvent(event)} />
                    </div>
                </div>
                <div className="register-btn">
                    <Button type="primary" className="button" onClick={this.register}>提交</Button>
                </div>
            </div>
        )
    }
}

class RestPassword extends Component {

    componentDidMount(){
        document.removeEventListener("backbutton", onBackKeyDown, false);
        document.addEventListener("deviceready", this.listenBackButton, false);
    }

    componentWillUnmount(){
        document.removeEventListener("deviceready", this.listenBackButton);
        document.removeEventListener("backbutton", this.backToMain);
    }

    listenBackButton = () => {
        setTimeout(() => {
            StatusBar.backgroundColorByHexString(CON.statusBarColor);
        }, 200)
        document.addEventListener("backbutton", this.backToMain, false)
    }

    backToMain = () => {
        window.goRoute(this, "/login")
    }

    resetPasswordKeyDownEvent = (evt) => {
        var e = evt;
        if (e.keyCode === 13) {
            window.$('.reset-password-username1').blur();
            window.$('.reset-password-password1').blur();
            window.$('.reset-password-password2').blur();
            window.$('.reset-password-password3').blur();
            this.resetPassword()
        }
    }

    resetPassword = () => {
        resetPasswordFunc(this);
    }

    render(){
        return(
            <div className="reset-password-area">
                <NavBar centerText="重置密码">
                     <div className="back-btn" onClick={this.backToMain}>
                         <i className="fa fa-angle-left"></i>
                     </div>
                </NavBar>
                <div className="input-content">
                   <div className="content">
                        <input type="text" className="reset-password-username1 form" placeholder="请输入用户名"
                            size="26" onKeyDown={(event) => this.resetPasswordKeyDownEvent(event)} />
                   </div>
                </div>
                <div className="input-content">
                    <div className="content">
                        <input type="password" className="reset-password-password1 form" placeholder="请输入旧密码"
                            size="26" onKeyDown={(event) => this.resetPasswordKeyDownEvent(event)} />
                   </div>
                </div>
                <div className="input-content">
                    <div className="content">
                        <input type="password" className="reset-password-password2 form" placeholder="请输入新密码"
                            size="26" onKeyDown={(event) => this.resetPasswordKeyDownEvent(event)} />
                    </div>
                </div>
                <div className="input-content">
                    <div className="content">
                       <input type="password" className="reset-password-password3 form" placeholder="请再次输入新密码"
                            size="26" onKeyDown={(event) => this.resetPasswordKeyDownEvent(event)} />
                   </div>
                </div>
                <div className="reset-password-btn">
                    <Button type="primary" className="button" value="提交" onClick={this.resetPassword}>提交</Button>
                </div>
                <div className="line-out">
                    <div className="line"></div>
               </div>
               <div className="tips-container">
                    <div className="tips">密码至少包含大小写字母和数字中的两种</div>
               </div>
            </div>
        )
    }
}

export  {
    Login,
    Register,
    RestPassword
};
