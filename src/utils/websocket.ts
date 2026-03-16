import { get as getGlobalData, set as setGlobalData } from '../global_data';
import { setOthersSignInfo } from '../pages/home/logic';
import { updateOnlinePersons } from '../store/home';
import { getStorage } from './utils';

let socketTask;
const initMiniProgramSocket = () => {
  socketTask = wx.connectSocket({
    url: `wss://api.zhoushoujian.com`,
    header: {
      'content-type': 'application/json',
    },
  });

  setGlobalData('socketTask', socketTask);

  wx.onSocketOpen(async () => {
    const userId = await getStorage('userId');
    const msg = {
      type: 'try-connect',
      userId,
      date: Date.now(),
    };
    if (process.env.TARO_ENV === 'weapp') {
      console.log('weapp openWS');
      wx.sendSocketMessage({ data: JSON.stringify(msg) });
      setInterval(reconnectAndSend, 60000);
    }
  });

  wx.onSocketError(function (res) {
    console.error('WebSocket连接打开失败，请检查！', res);
  });

  wx.onSocketMessage((data) => incomingMessage(data));
};

export const initWebsocket = () => {
  if (process.env.TARO_ENV === 'weapp') {
    initMiniProgramSocket();
  }
};

async function reconnectAndSend() {
  const message = { type: 'check-connect', userId: await getStorage('userId'), data: 'ping', date: Date.now() };
  if (process.env.TARO_ENV === 'weapp') {
    if (socketTask.readyState !== 1) {
      console.warn('reconnectAndSend wx.ws.readyState !== 1');
      await reconnectSocket();
    } else {
      wx.sendSocketMessage({ data: JSON.stringify(message) });
      //  10秒超时，如何收不到服务端pong响应则表示服务端已主动断开连接，此时需客户端重新开启websocket连接
      setTimeout(async () => {
        console.warn('reconnectAndSendTimeout reconnectSocket');
        await reconnectSocket();
      }, 10000);
    }
  }
}

const reconnectSocket = () => {
  if (process.env.TARO_ENV === 'weapp') {
    initMiniProgramSocket();
  }
};

const incomingMessage = async (data) => {
  try {
    data = JSON.parse(data.data);
    console.log('incomingMessage data', data);
    switch (data.type) {
      case 'response-date':
        console.info(`Roundtrip time: ${Date.now() - data.data} ms`);
        break;
      case 'order-string':
        console.info('order-string', data.data);
        break;
      case 'get-sign-array':
        setOthersSignInfo(data.data.response, null, null);
        console.info('get-sign-array', data);
        break;
      case 'online-persons':
        getGlobalData('$dispatch')(updateOnlinePersons(data.data));
        console.info(`当前在线人数: ${data.data}`);
        break;
      case 'pong':
        console.info('incomingMessage pong', data);
        break;
      case 'socket-heart-beat': {
        console.info('incomingMessage server-socket-heart-beat', data);
        const userId = await getStorage('userId');
        const msg = {
          type: 'check-connect',
          userId,
          data: 'reply-server-heart-beat',
          date: Date.now(),
        };
        if (process.env.TARO_ENV === 'weapp') {
          wx.sendSocketMessage({ data: JSON.stringify(msg) });
        }
        break;
      }
      default:
        console.warn('default incoming data type', data);
        break;
    }
  } catch (err) {
    console.error('onmessage JSON.parse', err.stack || err.toString());
  }
};
