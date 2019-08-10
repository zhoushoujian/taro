import { API_USER, API_USER_LOGIN } from '@constants/api'
import { createAction } from '@utils/redux'

const USER_INFO = 'USER_INFO'
const USER_LOGIN = 'USER_LOGIN'
const USER_LOGOUT = 'USER_LOGOUT'


const INITIAL_STATE = {
  userInfo: {}
}

export const user = function (state = INITIAL_STATE, action) {
  switch(action.type) {
    case USER_INFO: {
      return {
        ...state,
        userInfo: {
          ...action.payload,
          login: true
        }
      }
    }
    case USER_LOGIN: {
      return { ...state }
    }
    case USER_LOGOUT: {
      return {
        ...INITIAL_STATE
      }
    }
    default:
      return state
  }
}


/**
 * 获取用户信息
 * @param {*} payload
 */
export const dispatchUser = payload => createAction({
  url: API_USER,
  fetchOptions: {
    showToast: false,
    autoLogin: false
  },
  type: USER_INFO,
  payload
})

/**
 * 用户登录
 * @param {*} payload
 */
export const dispatchLogin = payload => createAction({
  url: API_USER_LOGIN,
  type: USER_LOGIN,
  payload
})

/**
 * 用户退出登录
 */
export const dispatchLogout = () => ({ type: USER_LOGOUT })
