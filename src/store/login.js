//actionType
const USERNAME = "login/username";
const PASSWORD = "login/password";
const TOKEN = "login/token";
const IS_FROM_LOGIN_PAGE = "login/isFromLoginPage";
const LOG_OUT_Flag = 'login/logOutFlag';

// initialSate
const initialState = () => ({
  username: "",
  password: "",
  token: "",
  isFromLoginPage: false,
  logOutFlag: false
});

// Reducer
export const login = function reducer(state = initialState(), action = {}) {
  switch (action.type) {
    case USERNAME:
      return Object.assign({}, state, { username: action.data });
    case PASSWORD:
      return Object.assign({}, state, { password: action.data });
    case TOKEN:
      return Object.assign({}, state, { token: action.data });
    case IS_FROM_LOGIN_PAGE:
        return Object.assign({}, state, { isFromLoginPage: action.data });
    case LOG_OUT_Flag:
        return Object.assign({}, state, { logOutFlag: action.data });
    default:
      return state;
  }
}

// update
export const updateUsername = data => ({
  type: USERNAME,
  data
});

export const updatePassword = data => ({
  type: PASSWORD,
  data
});

export const updateToken = data => ({
  type: TOKEN,
  data
});

export const updateIsFromLoginPage = data => ({
  type: IS_FROM_LOGIN_PAGE,
  data
})

export const updateLogOutFlag = data => ({
    type: LOG_OUT_Flag,
    data
  })


