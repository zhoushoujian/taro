const SHOW_UPDATE_BANNER = "sign/showUpdateBanner";
const IS_SIGNED_UP = "sign/isSignedUp";
const LAST_SIGN_UP_TIME = "sign/lastSignUpTime";
const ALREADY_SIGN_UP_PERSONS = "sign/alreadySignUpPersons";
const NOT_SIGN_UP_PERSONS = "sign/notSignUpPersons";
const ONLINE_PERSONS = "sign/onlinePersons"


const INITIAL_STATE = {
  showUpdateBanner: false,
  isSignedUp: false,
  lastSignUpTime: "",
  alreadySignUpPersons: "",
	notSignUpPersons: "",
	onlinePersons: 0
}

export const home = function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SHOW_UPDATE_BANNER:
      return Object.assign({}, state, { showUpdateBanner: action.data });
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
    default:
      return state;
  }
}

export const updateShowUpdateBanner = data => ({
  type: SHOW_UPDATE_BANNER,
  data
});

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
