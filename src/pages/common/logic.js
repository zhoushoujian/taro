import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"
import { AtToast } from "taro-ui"
import { updateOnlinePersons } from "../../store/home"
import "taro-ui/dist/style/components/toast.scss";
import "taro-ui/dist/style/components/icon.scss";
import "taro-ui/dist/style/components/modal.scss";

export const networkErr = (err) => {
  if(err === undefined){
    return <AtToast isOpened text="请检查网络连接" ></AtToast>
  } else {
		if(Object.prototype.toString.call(err) === '[object Error]'){
			console.error("networkErr" , err.stack || err.toString())
		} else if(Object.prototype.toString.call(err) === '[object Object]') {
			console.error("networkErr" , err)
		} else {
			console.error("networkErr" , JSON.stringify(err))
		}
	}
}

export const initWebsocket = () => {
	let userId = 'no-ls-' + String(Date.now() + (Math.random()*10000).toFixed(0))
	let logger = window.logger ? window.logger : console;
	if('localStorage' in window){
		if(window.localStorage.getItem("userId")){
			userId = window.localStorage.getItem("userId")
		} else {
			userId = "ls" + String(Date.now() + (Math.random()*10000).toFixed(0))
			window.localStorage.setItem("userId", userId);
		}
	}
	if(window.WebSocket){
		window.ws = new WebSocket(`ws://${window.config.host}:${window.config.socketPort}`);
		window.ws.onopen = () => {
			openWS(ws.readyState, userId)
			window.checkSocketState = setInterval(() => {
				if(window.ws.readyState !== 1){
					window.ws.close()
					logger.warn("正在重新建立连接...");
					window.ws = new WebSocket(`ws://${window.config.host}:${window.config.socketPort}`);
					window.ws.onopen = () => openWS(window.ws.readyState, userId);
					window.ws.onmessage = (data) => incomingMessage(data);
				} else {
					let message = Object.assign({},{ type:'check-connect', userId, date: "ping" });
					window.ws.send(JSON.stringify(message));
				}
			}, 20000)
		};
		window.ws.onmessage = (data) => incomingMessage(data);
	} else {
		console.info("不支持webSocket！！！")
	}
}

export const openWS = (readyState, userId) => {
	let logger = window.logger ? window.logger : console;
	logger.info('connected', readyState);
	logger.info("当前用户id", userId)
	let msg = Object.assign({},{
		type:'try-connect',
		userId,
		date: Date.now()
	})
	window.ws.send(JSON.stringify(msg));
}

export const incomingMessage = (data) => {
	try {
		let logger = window.logger ? window.logger : console;
		data = JSON.parse(data.data);
		switch(data.type){
			case "response-date":
				logger.info(`Roundtrip time: ${Date.now() - data.data} ms`);
				break;
			case "order-string":
				logger.info(data.data);
				break;
			case "get-sign-array":
				// setOthersSignInfo(data.data)
				logger.info(data);
				break;
			case "heart-beat":
				logger.info(data);
				break;
			case "online-persons":
				updateOnlinePersons(data.data);
				logger.info(`当前在线人数: ${data.data}`);
				break;
			default:
				break;
		}
	} catch (err){
		logger.error("onmessage JSON.parse", err.stack || err.toString())
	}
}
