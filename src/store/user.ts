const SET_NICKNAME = "myInfo/setNickname";
const SET_HEAD_PIC = "myInfo/setHeadPic";

const INITIAL_STATE = {
  setNickname: "",
  setHeadPic: ""
}

export const user = function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_NICKNAME:
      return Object.assign({}, state, { setNickname: action.data });
    case SET_HEAD_PIC:
      return Object.assign({}, state, { setHeadPic: action.data });
    default:
      return state;
  }
}

export const updateSetNickname = data => ({
  type: SET_NICKNAME,
  data
});

export const updateSetHeadPic = data => ({
  type: SET_HEAD_PIC,
  data
});
