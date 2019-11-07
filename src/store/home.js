const IS_SIGNED_UP = "sign/isSignedUp";
const LAST_SIGN_UP_TIME = "sign/lastSignUpTime";
const ALREADY_SIGN_UP_PERSONS = "sign/alreadySignUpPersons";
const NOT_SIGN_UP_PERSONS = "sign/notSignUpPersons";
const ONLINE_PERSONS = "sign/onlinePersons"
const SIGNED_FLAG = "sign/signedFlag"
const ONLINE_PERSONS_NAME = "sign/onlinePersonsName";

const INITIAL_STATE = {
  isSignedUp: false,
  lastSignUpTime: "",
  alreadySignUpPersons: "",
	notSignUpPersons: "",
  onlinePersons: 0,
  signedFlag: "",
  onlinePersonsName: "",
}

export const home = function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case IS_SIGNED_UP:
      return Object.assign({}, state, { isSignedUp: action.data });
    case LAST_SIGN_UP_TIME:
      return Object.assign({}, state, { lastSignUpTime: action.data });
    case ALREADY_SIGN_UP_PERSONS:
      return Object.assign({}, state, { alreadySignUpPersons: action.data });
    case NOT_SIGN_UP_PERSONS:
      return Object.assign({}, state, { notSignUpPersons: action.data });
    case ONLINE_PERSONS:
      return Object.assign({}, state, { onlinePersons: action.data });
    case SIGNED_FLAG:
      return Object.assign({}, state, { signedFlag: action.data });
    case SIGNED_FLAG:
			return Object.assign({}, state, {  onlinePersonsName: action.data });
    default:
      return state;
  }
}

export const updateSignUpStatus = data => ({
  type: IS_SIGNED_UP,
  data
});

export const updateLastSignUpTime = data => ({
  type: LAST_SIGN_UP_TIME,
  data
});
export const updateAlreadySignUpPersons = data => ({
  type: ALREADY_SIGN_UP_PERSONS,
  data
});

export const updateNotSignUpPersons = data => ({
  type: NOT_SIGN_UP_PERSONS,
  data
});

export const updateOnlinePersons = data => ({
  type: ONLINE_PERSONS,
  data
});

export const updateSignedFlag = data => ({
  type: SIGNED_FLAG,
  data
});

export const updateOnlinePersonsName = data => ({
	type: ONLINE_PERSONS_NAME,
	data
})
