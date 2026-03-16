import Taro from '@tarojs/taro';

export const networkErr = (err) => {
  if (err === undefined) {
    Taro.showToast({
      title: '请检查网络连接',
      icon: 'none',
      duration: 2000,
    });
  } else {
    if (Object.prototype.toString.call(err) === '[object Error]') {
      console.error('networkErr', err.stack || err.toString());
    } else if (Object.prototype.toString.call(err) === '[object Object]') {
      console.error('networkErr', err);
    } else {
      console.error('networkErr', JSON.stringify(err));
    }
  }
};

export const getStorage = (key, isSync = false) => {
  if (typeof key !== 'string') {
    throw new Error('key is typeof string at Utils.storage.Get');
  }
  if (key.trim() === '') {
    throw new Error('key is not null at Utils.storage.Get');
  }
  return new Promise((resolve) => {
    if (isSync) {
      const result = Taro.getStorageSync(key.trim());
      resolve(result);
    } else {
      Taro.getStorage({
        key: key.trim(),
        success(res) {
          const result = res.data;
          resolve(result);
        },
        fail() {
          resolve(null);
        },
      });
    }
  });
};

export const setStorage = (key, data, isSync = false) => {
  if (typeof key !== 'string') {
    throw new Error('key is typeof string at Utils.storage.Set');
  }
  if (key.trim() === '') {
    throw new Error('key is not null at Utils.storage.Set');
  }
  return new Promise((resolve) => {
    if (isSync) {
      Taro.setStorageSync(key.trim(), data);
      resolve({
        msg: 'storage okay',
      });
    } else {
      Taro.setStorage({
        key: key.trim(),
        data,
        success() {
          resolve({
            msg: 'storage okay',
          });
        },
      });
    }
  });
};

export const removeStorage = (key = '', isSync = false) => {
  if (typeof key !== 'string') {
    throw new Error('key is typeof string at Utils.storage.rm');
  }
  return new Promise((resolve) => {
    if (key === '') {
      if (isSync) {
        Taro.clearStorage({
          success() {
            resolve({
              msg: 'clearStorage is okay',
            });
          },
        });
      } else {
        Taro.clearStorageSync();
        resolve({
          msg: 'clearStorage is okay',
        });
      }
    } else {
      if (!isSync) {
        Taro.removeStorage({
          key: key.trim(),
          success() {
            resolve({
              msg: 'removeStorage is okay',
            });
          },
        });
      } else {
        Taro.removeStorageSync(key.trim());
        resolve({
          msg: 'removeStorage is okay',
        });
      }
    }
  });
};

export const request = async (url, payload?: any, method = 'GET') => {
  let token;
  if (payload && payload.token) {
    token = payload.token;
  } else {
    token = await getStorage('tk');
  }
  const header = token ? { Authorization: token } : {};
  method = method.toUpperCase();
  if (method === 'POST') {
    header['content-type'] = 'application/json';
  }

  return Taro.request({
    url,
    //@ts-ignore
    method,
    data: payload,
    header,
  })
    .then(async (res) => {
      return res;
    })
    .catch((err) => {
      networkErr(err);
      return Promise.reject(err);
    });
};

export const formatDate = (fmt: string) => {
  const date = new Date();
  const o = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return fmt;
};
