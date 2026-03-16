import { HTTP_URL } from '../../constants/api';
import { get as getGlobalData } from '../../global_data';
import { updateAlreadySignUpPersons, updateNotSignUpPersons } from '../../store/home';
import { formatDate, networkErr, removeStorage, request } from '../../utils/utils';

export const signed = (updateSignUpStatus, updateSignedFlag) => {
  updateSignUpStatus(true);
  updateSignedFlag('signed-flag');
};

export const autoLogin = function (token, updateUsername, updateSetNickname, updateSetHeadPic) {
  return new Promise((res) => {
    return request(HTTP_URL.tokenLogin, { token }, 'post')
      .then(async (response) => {
        console.info(`auto login  response`, response.data);
        const result = response.data.result;
        if (result.token && result.username) {
          const userProfile = result.userProfile || {};
          updateUsername(result.username);
          updateSetNickname(userProfile.nickname);
          updateSetHeadPic(userProfile.user_pic);
          res(0);
        } else if (result === 'token_expired') {
          console.warn('身份已过期,请重新登录');
          await removeStorage('tk', true);
          res(0);
        } else {
          console.warn('非法登录');
          await removeStorage('tk', true);
          res(0);
        }
      })
      .catch(async (err) => {
        console.error(`autoLogin err`, err);
        if (err.message === 'Network Error') {
          getGlobalData('alert')('请检查网络连接');
        }
        await removeStorage('tk', true);
        res(0);
      });
  });
};

export const retrieveOthers = (token, updateAlreadySignUpPersons, updateNotSignUpPersons) => {
  if (token) {
    const data = { token };
    return request(HTTP_URL.retrieveOthers, data, 'post')
      .then((response) => {
        const responseText = response.data;
        setOthersSignInfo(responseText.result.response, updateAlreadySignUpPersons, updateNotSignUpPersons);
      })
      .catch((err) => {
        networkErr(err);
      });
  }
};

type ISignedArray = {
  username: string;
  origin: string;
};
export const setOthersSignInfo = (data, updateAlreadySignUpPersonsParam, updateNotSignUpPersonsParam) => {
  if (!data) return;
  const date = formatDate('yyyy-MM-dd'),
    info = data,
    signedArray = [] as ISignedArray[],
    unsignedArray = [] as ISignedArray[];
  for (let i = 0, l = info.length; i < l; i++) {
    if (info[i].date && info[i].date.split(' ')[0] === date) {
      signedArray.push({
        username: info[i].username,
        origin: info[i].origin,
      });
    } else {
      unsignedArray.push({
        username: info[i].username,
        origin: info[i].origin,
      });
    }
  }
  if (!updateAlreadySignUpPersonsParam && !updateNotSignUpPersonsParam) {
    getGlobalData('$dispatch')(updateAlreadySignUpPersons(signedArray));
    getGlobalData('$dispatch')(updateNotSignUpPersons(unsignedArray));
  } else {
    updateAlreadySignUpPersonsParam(signedArray);
    updateNotSignUpPersonsParam(unsignedArray);
  }
};

export const retrieveLastLoginTime = (token, updateLastSignUpTime, updateSignUpStatus, updateSignedFlag) => {
  if (token) {
    const data = Object.assign({}, { token });
    return request(HTTP_URL.lastSign, data, 'post')
      .then((response) => {
        console.info(`retrieveLastLoginTime  response`, response.data);
        const date = formatDate('yyyy-MM-dd');
        const lastSignUpTime = response.data.result.lastDay;
        if (lastSignUpTime && lastSignUpTime.split(' ')[0] === date) {
          signed(updateSignUpStatus, updateSignedFlag);
        }
        updateLastSignUpTime(lastSignUpTime);
      })
      .catch((err) => {
        networkErr(err);
      });
  }
};

export const signInApp = (
  isSignedUp,
  token,
  updateToken,
  updateAlreadySignUpPersons,
  updateNotSignUpPersons,
  updateSignUpStatus,
  updateLastSignUpTime,
  updateSignedFlag,
) => {
  console.log('signInApp isSignedUp', isSignedUp);
  if (isSignedUp) return;
  if (token) {
    return request(
      HTTP_URL.goSign,
      {
        token,
        CurrentTime: formatDate('yyyy-MM-dd'),
      },
      'post',
    )
      .then((response) => {
        console.info(`signIn  response`, response.data);
        if (response.data.result.str === 'already_signed') {
          getGlobalData('alert')('已签到');
          signed(updateSignUpStatus, updateSignedFlag);
          return;
        } else if (response.data.result.str === 'token_expired') {
          console.error(`身份已过期,请重新登录页`);
          updateToken('');
        } else if (response.data.result.str === 'no_sign') {
          //更新token
          updateToken(response.data.result.token);
          getGlobalData('alert')('签到成功');
          retrieveLastLoginTime(token, updateLastSignUpTime, updateSignUpStatus, updateSignedFlag);
          retrieveOthers(token, updateAlreadySignUpPersons, updateNotSignUpPersons);
          return;
        } else if (response.data.result.str === 'error') {
          getGlobalData('alert')('签到失败');
        } else if (response.data.result.str === 'error_in_client_time') {
          getGlobalData('alert')('签到失败，请检查时间设置');
        } else {
          getGlobalData('alert')(response.data);
        }
      })
      .catch((err) => {
        getGlobalData('alert')(`signInApp ${JSON.stringify(err)}`);
        networkErr(err);
      });
  }
};
