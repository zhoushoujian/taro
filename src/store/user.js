const SET_NICKNAME = "myInfo/setNickname";
const SET_MOBILE = "myInfo/setMobile";
const SET_SIGNATURE = "myInfo/setSignature";
const SET_SEX = "myInfo/setSex";
const SET_BIRTHDAY = "myInfo/setBirthday";
const SET_HEAD_PIC = "myInfo/setHeadPic";
const SET_ADDRESS = "myInfo/setAddress";
const SET_SYSTEM_SETUP_DOT = "myInfo/setSystemSetupDot"

const INITIAL_STATE = {
  setNickname: "",
  setMobile: "",
  setSignature: "",
  setSex: "",
  setBirthday: "",
  setHeadPic: "",
	setAddress: "",
	setSystemSetupDot: false
}

export const user = function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_NICKNAME:
      return Object.assign({}, state, { setNickname: action.data });
    case SET_MOBILE:
      return Object.assign({}, state, { setMobile: action.data });
    case SET_SIGNATURE:
      return Object.assign({}, state, { setSignature: action.data });
    case SET_SEX:
      return Object.assign({}, state, { setSex: action.data });
    case SET_BIRTHDAY:
      return Object.assign({}, state, { setBirthday: action.data });
    case SET_HEAD_PIC:
      return Object.assign({}, state, { setHeadPic: action.data });
    case SET_ADDRESS:
	  return Object.assign({}, state, { setAddress: action.data });
	case SET_SYSTEM_SETUP_DOT:
      return Object.assign({}, state, { setSystemSetupDot: action.data });
    default:
      return state;
  }
}

export const updateSetNickname = data => ({
  type: SET_NICKNAME,
  data
});
export const updateSetMobile = data => ({
  type: SET_MOBILE,
  data
});
export const updateSignature = data => ({
  type: SET_SIGNATURE,
  data
});
export const updateSetSex = data => ({
  type: SET_SEX,
  data
});
export const updateSetBirthday = data => ({
  type: SET_BIRTHDAY,
  data
});
export const updateSetHeadPic = data => ({
  type: SET_HEAD_PIC,
  data
});
export const updateSetAddress = data => ({
  type: SET_ADDRESS,
  data
});
