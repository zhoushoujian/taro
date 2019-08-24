import { HTTP_URL } from "../../constants/api"
import { networkErr } from "../common/logic";
import { updateAlreadySignUpPersons, updateNotSignUpPersons} from "../../store/home";

export const greetings = () => {
  let hour = new Date().getHours();
    if (hour < 6) {
      document.getElementsByClassName("greetings")[0].innerHTML = "凌晨好！&nbsp;";
    } else if (hour < 8) {
      document.getElementsByClassName("greetings")[0].innerHTML = "早上好！&nbsp;";
    } else if (hour < 11) {
      document.getElementsByClassName("greetings")[0].innerHTML = "上午好！&nbsp;";
    } else if (hour < 14) {
      document.getElementsByClassName("greetings")[0].innerHTML = "中午好！&nbsp;";
    } else if (hour < 17) {
      document.getElementsByClassName("greetings")[0].innerHTML = "下午好！&nbsp;";
    } else if (hour < 19) {
      document.getElementsByClassName("greetings")[0].innerHTML = "傍晚好！&nbsp;";
    } else if (hour < 24) {
      document.getElementsByClassName("greetings")[0].innerHTML = "晚上好！&nbsp;";
    }
}

export const signed = (updateSignUpStatus) => {
  updateSignUpStatus(true);
	window.$(".sign-area .sign").html("已签到")
		.css({"color":"#EDEDED", "backgroundColor": "#C0C0C0", "border": 0, "cursor": "default", "boxShadow": "none"})
}

export const autoLogin = function(token, updateUsername, updateSetNickname, updateSetHeadPic){
	return new Promise((res,rej) => {
		let data = Object.assign({}, { token })
		return axios.post(HTTP_URL.tokenLogin, data)
			.then((response) => {
				window.logger.info(`auto login  response`, response.data);
				let result = response.data.result;
				if (result.token && result.username) {
					let userProfile = result.userProfile || {};
					updateUsername(result.username);
					updateSetNickname(userProfile.nickname);
					updateSetHeadPic(userProfile.user_pic);
					res();
				} else if (result === 'token_expired') {
					window.logger.warn("身份已过期,请重新登录");
					alert("身份已过期,请重新登录");
					rej()
				} else {
					window.logger.warn("非法登录");
					alert("非法登录");
					rej()
				}
			})
			.catch(err => {
				window.logger.error(`autoLogin err`, err);
				if (err.message === 'Network Error') {
					alert("请检查网络连接");
				} else {
					alert(err.stack||err.toString())
				}
			})
	})
}

export const retrieveOthers = (token, updateAlreadySignUpPersons, updateNotSignUpPersons) => {
	if(token){
		const data = Object.assign({}, { token });
		return axios.post(HTTP_URL.retrieveOthers, (data))
			.then((response) => {
				const responseText = response.data;
				setOthersSignInfo(responseText.result, updateAlreadySignUpPersons, updateNotSignUpPersons)
			})
	}
}

export const setOthersSignInfo = (data, updateAlreadySignUpPersonsParam, updateNotSignUpPersonsParam) => {
	let date = new Date().format("yyyy-MM-dd"),
	  info = data,
		signedArray = [],
		unsignedArray = [];
	for (let i = 0, l = info.length; i < l; i++) {
		if (info[i].date && info[i].date.split(' ')[0] === date) {
			signedArray.push(info[i].username);
		} else {
			unsignedArray.push(info[i].username);
		}
	}
	let signedPersons = String(signedArray).replace(/,/g,", ");
  let unsignedPersons = String(unsignedArray).replace(/,/g,", ");
  if(!updateAlreadySignUpPersonsParam && !updateNotSignUpPersonsParam){
    window.$dispatch(updateAlreadySignUpPersons(signedPersons));
    window.$dispatch(updateNotSignUpPersons(unsignedPersons));
  } else {
    updateAlreadySignUpPersonsParam(signedPersons);
    updateNotSignUpPersonsParam(unsignedPersons);
  }

}


export const retrieveLastLoginTime = (token, updateLastSignUpTime, updateSignUpStatus) => {
	if(token){
		const data = Object.assign({}, { token });
		return axios.post(HTTP_URL.lastSign, data)
			.then((response) => {
				window.logger.info(`retrieveLastLoginTime  response`, response.data)
				let date = new Date().format("yyyy-MM-dd");
				let lastSignUpTime = response.data.result.lastDay;
				if(lastSignUpTime.split(" ")[0] === date) signed(updateSignUpStatus);
				updateLastSignUpTime(lastSignUpTime);
			})
	}
}

export const signInApp = async (isSignedUp, token, updateToken, updateAlreadySignUpPersons, updateNotSignUpPersons, updateSignUpStatus, updateLastSignUpTime) => {
	if(isSignedUp) return;
  let signFlag;
	if (signFlag) return;
  signFlag = true;
	let date = new Date().format("yyyy-MM-dd");
	if(token){
		let data = Object.assign({}, {
			token,
			CurrentTime: date
		});
		return axios.post(HTTP_URL.goSign, data)
			.then((response) => {
				signFlag = false;
				window.logger.info(`signIn  response`, response.data);
				if (response.data.result.str === "already_signed") {
					alert("已签到");
					signed(updateSignUpStatus);
					return;
				} else if (response.data.result.str === "token_expired"){
					window.logger.error(`身份已过期,请重新登录页`);
					updateToken("");
					let { username } = window.$getState().login;
					document.getElementsByName("username")[0].value = username;
				} else if (response.data.result.str === "no_sign") {
					//更新token
					updateToken(response.data.result.token);
					alert("签到成功");
					signed(updateSignUpStatus);
          retrieveLastLoginTime(token, updateLastSignUpTime, updateSignUpStatus)
					retrieveOthers(token, updateAlreadySignUpPersons, updateNotSignUpPersons);
					return;
				} else if(response.data.result.str === "error"){
					alert("签到失败");
				} else if(response.data.result.str === "error_in_client_time"){
					alert("签到失败，请检查时间设置");
				} else {
					alert(response.data)
				}
			})
			.catch(err => {
        // window.logger.error(`signIn, err`, err.stack||error.toString());
        networkErr(err);
		})
	}
}
