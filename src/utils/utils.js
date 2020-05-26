import Taro from '@tarojs/taro'
import { setOthersSignInfo } from "../pages/home/logic"
import { updateOnlinePersons } from "../store/home"
import { get as getGlobalData, set as setGlobalData } from '../global_data'

let receiveServerSocketPong = false;
let reconnectAndSendTimeout = null;
const callbackFunc = (index) => {
	logger.info("callbackFunc  index", index)
	if(reconnectAndSendTimeout) clearInterval(reconnectAndSendTimeout)
}
let observer1 = null;

export const networkErr = (err) => {
  if(err === undefined){
    Taro.showToast({
      title: "请检查网络连接",
      icon: 'none',
      duration: 2000
    })
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

const initMiniProgramSocket = (platform, userId, name) => {
  const socketTask = platform['connectSocket']({
    url: `wss://api.zhoushoujian.com`,
    header: {
      'content-type': 'application/json'
    }
  })

  setGlobalData('socketTask', socketTask)

  if(platform === 'weapp'){
    observer1 = new wx.Observer(callbackFunc)
    wx.subjectModel.subscribeObserver(observer1)
  } else if(platform === "alipay"){
    observer1 = new my.Observer(callbackFunc)
    my.subjectModel.subscribeObserver(observer1)
  }

  platform['onSocketOpen'](() => {
    return openWS(name, userId)
  })

  platform['onSocketError'](function (res) {
    console.error('WebSocket连接打开失败，请检查！', res)
  })

  platform['onSocketMessage']((data) => incomingMessage(data))
}

export const initWebsocket = async () => {
	const userId = await getStorage("userId")
  if(process.env.TARO_ENV === 'weapp'){
    initMiniProgramSocket(wx, userId, "weapp")
  } else if (process.env.TARO_ENV === 'alipay') {
    initMiniProgramSocket(my, userId, "alipay")
  }
}

export const openWS = (readyState, userId) => {
	console.info('connected', readyState);
	console.info("当前用户id", userId)
	let msg = Object.assign({},{
		type:'try-connect',
		userId,
		date: Date.now()
  })
  if(process.env.TARO_ENV === 'weapp'){
    console.log("weapp openWS")
    wx.sendSocketMessage({data: JSON.stringify(msg)})
    wx.websocketHeartBeatInterval = setInterval(reconnectAndSend, 60000)
  } else if(process.env.TARO_ENV === 'alipay'){
    console.log("alipay openWS")
    my.sendSocketMessage({data: JSON.stringify(msg)})
    my.websocketHeartBeatInterval = setInterval(reconnectAndSend, 60000)
  }

}

export const incomingMessage = async(data) => {
	try {
    data = JSON.parse(data.data);
    console.log('incomingMessage data', data)
		switch(data.type){
			case "response-date":
				console.info(`Roundtrip time: ${Date.now() - data.data} ms`);
				break;
			case "order-string":
				console.info('order-string', data.data);
				break;
			case "get-sign-array":
				setOthersSignInfo(data.data.response)
				console.info('get-sign-array', data);
				break;
			case "online-persons":
				getGlobalData('$dispatch')(updateOnlinePersons(data.data));
				console.info(`当前在线人数: ${data.data}`);
        break;
      case "pong":
        logger.info('incomingMessage pong', data);
        receiveServerSocketPong = true;
        subjectModel.notifyObserver(observer1)
        break;
      case "socket-heart-beat":
        console.info('incomingMessage server-socket-heart-beat', data);
        const userId = await getStorage("userId")
				const msg = {
					type:'check-connect',
					userId,
					data: "reply-server-heart-beat",
					date: Date.now()
				}
        if(process.env.TARO_ENV === 'weapp'){
          wx.sendSocketMessage({data: JSON.stringify(msg)})
        } else if(process.env.TARO_ENV === 'alipay'){
          my.sendSocketMessage({data: JSON.stringify(msg)})
        }
				break;
			default:
        console.warn("default incoming data type", data)
				break;
		}
	} catch (err){
		console.error("onmessage JSON.parse", err.stack || err.toString())
	}
}

export const getStorage = (key, isSync = false) => {
  if (typeof key != "string") {
    throw new Error("key is typeof string at Utils.storage.Get");
  }
  if (key.trim() == "") {
    throw new Error("key is not null at Utils.storage.Get");
  }
  return new Promise((resolve, reject) => {
    if (isSync) {
      let result = Taro.getStorageSync(key.trim());
      resolve(result);
    } else {
      Taro.getStorage({
        key:key.trim(),
        success: function (res) {
          let result = res.data;
          resolve(result)
        },
        fail(error){
          resolve(null);
        }
      })
    }
  })
}

export const setStorage = (key, data, isSync = false) => {
  if (typeof key != "string") {
    throw new Error("key is typeof string at Utils.storage.Set");
  }
  if (key.trim() == "") {
    throw new Error("key is not null at Utils.storage.Set");
  }
  return new Promise((resolve, reject) => {
    if (isSync) {
      Taro.setStorageSync(key.trim(), data)
      resolve({
        msg: "storage okay",
      });
    } else {
      Taro.setStorage({
        key:key.trim(),
        data,
        success: function (res) {
          resolve({
            msg: "storage okay",
          })
        },
      })
    }
  })
}

export const removeStorage = (key = "", isSync = false) => {
  if (typeof key != "string") {
    throw new Error("key is typeof string at Utils.storage.rm");
  }
  return new Promise((resolve, reject) => {
    if (key == "") {
      if (isSync) {
        Taro.clearStorage({
          success() {
            resolve({
              msg: "clearStorage is okay"
            })
          }
        })
      } else {
        Taro.clearStorageSync();
        resolve({
          msg: "clearStorage is okay"
        })
      }
    } else {
      if (!isSync) {
        Taro.removeStorage({
          key:key.trim(),
          success() {
            resolve({
              msg: "removeStorage is okay"
            })
          }
        })
      } else {
        Taro.removeStorage(key.trim());
        resolve({
          msg: "removeStorage is okay"
        })
      }
    }
  })
}

export const fetch = async (url, payload, method = 'GET') => {
  let token;
  if(payload && payload.token){
    token = payload.token
  } else {
    token = await getStorage('tk')
  }
  const header = token ? { Authorization: token } : {}
  method = method.toUpperCase()
  if (method === 'POST') {
    header['content-type'] = 'application/json'
  }

  return Taro.request({
    url,
    method,
    data: payload,
    header
  })
  .then(async (res) => {
    return res
  })
  .catch(err => {
    networkErr(err)
    return Promise.reject(err)
  })
}

async function reconnectAndSend(){
  const message = Object.assign({},{ type:'check-connect', userId: await getStorage("userId"), data: "ping", date: Date.now() });
  if(process.env.TARO_ENV === 'weapp'){
    if(wx.ws.readyState !== 1){
      console.warn("reconnectAndSend wx.ws.readyState !== 1")
      await reconnectSocket('heart beat')
    } else {
      wx.ws.sendSocketMessage(JSON.stringify(message));
      receiveServerSocketPong = false;
      //  10秒超时，如何收不到服务端pong响应则表示服务端已主动断开连接，此时需客户端重新开启websocket连接
      reconnectAndSendTimeout = setTimeout(async () => {
        console.warn("reconnectAndSendTimeout reconnectSocket")
        reconnectAndSendTimeout = null
        await reconnectSocket('heart beat')
      }, 10000)
    }
  } else if(process.env.TARO_ENV === 'alipay'){
    if(my.ws.readyState !== 1){
      console.warn("reconnectAndSend my.ws.readyState !== 1")
      await reconnectSocket('heart beat')
    } else {
      my.ws.sendSocketMessage(JSON.stringify(message));
      receiveServerSocketPong = false;
      //  10秒超时，如何收不到服务端pong响应则表示服务端已主动断开连接，此时需客户端重新开启websocket连接
      reconnectAndSendTimeout = setTimeout(async () => {
        console.warn("reconnectAndSendTimeout reconnectSocket")
        reconnectAndSendTimeout = null
        await reconnectSocket('heart beat')
      }, 10000)
    }
  }

}

export const reconnectSocket = async () => {
  const userId = await getStorage("userId")
  if (process.env.TARO_ENV === 'weapp') {
    initMiniProgramSocket(wx, userId, "weapp")
  } else if (process.env.TARO_ENV === 'alipay') {
    initMiniProgramSocket(wx, userId, "alipay")
  }
}
