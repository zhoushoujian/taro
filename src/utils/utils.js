import Taro from '@tarojs/taro'
import { setOthersSignInfo } from "../pages/home/logic"
import { updateOnlinePersons } from "../store/home"
import { get as getGlobalData, set as setGlobalData } from '../global_data'
import "taro-ui/dist/style/components/toast.scss";

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

export const initWebsocket = async () => {
	let userId = 'no-ls-' + String(Date.now() + (Math.random()*10000).toFixed(0))
	if(await getStorage("userId")){
		userId = await getStorage("userId")
	} else {
		userId = "ls" + String(Date.now() + (Math.random()*10000).toFixed(0))
		await setStorage("userId", userId);
	}
	if(WebSocket){
		window.ws = new WebSocket(`ws://${getGlobalData('config').host}:${getGlobalData('config').socketPort}`);
		window.ws.onopen = () => {
			openWS(ws.readyState, userId)
			window.checkSocketState = setInterval(() => {
				if(window.ws.readyState !== 1){
					window.ws.close()
					console.warn("正在重新建立连接...");
					window.ws = new WebSocket(`ws://${getGlobalData('config').host}:${getGlobalData('config').socketPort}`);
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
    if(process.env.TARO_ENV === 'weapp'){
      wx.connectSocket({
        url: `ws://${getGlobalData('config').host}:${getGlobalData('config').socketPort}`,
        header:{
          'content-type': 'application/json'
        }
      })

      wx.onSocketOpen(() => {
        return openWS(wx.readyState, userId)
      })

      wx.onSocketError(function (res) {
        console.error('WebSocket连接打开失败，请检查！')
      })

      wx.onSocketMessage((data) => incomingMessage(data))
    }
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
  if(window){
    window.ws.send(JSON.stringify(msg));
  } else {
    console.log('msg', msg)
    wx.sendSocketMessage({data: JSON.stringify(msg)})
  }
}

export const incomingMessage = (data) => {
	try {
    data = JSON.parse(data.data);
    console.log('data', data)
		switch(data.type){
			case "response-date":
				console.info(`Roundtrip time: ${Date.now() - data.data} ms`);
				break;
			case "order-string":
				console.info(data.data);
				break;
			case "get-sign-array":
				setOthersSignInfo(data.data)
				console.info(data);
				break;
			case "heart-beat":
				console.info(data);
				break;
			case "online-persons":
				getGlobalData('$dispatch')(updateOnlinePersons(data.data));
				console.info(`当前在线人数: ${data.data}`);
				break;
			default:
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

export const isWeapp = () => process.env.TARO_ENV === 'weapp'
