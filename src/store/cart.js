import {
  API_CART, API_CART_NUM, API_CART_RECOMMEND,
  API_CART_ADD, API_CART_UPDATE, API_CART_UPDATE_CHECK
} from '@constants/api'
import { createAction } from '@utils/redux'
import Taro from '@tarojs/taro'

const CART_INFO = 'CART_INFO'
const CART_NUM = 'CART_NUM'
const CART_RECOMMEND = 'CART_RECOMMEND'
const CART_ADD = 'CART_ADD'
const CART_UPDATE = 'CART_UPDATE'
const CART_UPDATE_CHECK = 'CART_UPDATE_CHECK'

const INITIAL_STATE = {
  cartInfo: {},
  recommend: {}
}

// TODO H5、RN 还不支持 setTabBarBadge
const updateTabBar = (count) => {
  if (count > 0) {
    Taro.setTabBarBadge({
      index: 2,
      text: `${count}`
    })
  } else {
    Taro.removeTabBarBadge({
      index: 2
    })
  }
}

export const cart = function (state = INITIAL_STATE, action) {
  switch(action.type) {
    case CART_INFO:
    case CART_ADD:
    case CART_UPDATE:
    case CART_UPDATE_CHECK: {
      return {
        ...state,
        cartInfo: action.payload
      }
    }
    case CART_NUM: {
      updateTabBar(action.payload.countCornerMark)
      return state
    }
    case CART_RECOMMEND: {
      return {
        ...state,
        recommend: action.payload
      }
    }
    default:
      return state
  }
}

/**
 * 购物车信息
 * @param {*} payload
 */
export const dispatchCart = payload => createAction({
  url: API_CART,
  type: CART_INFO,
  payload
})

/**
 * 购物车物品数量
 * @param {*} payload
 */
export const dispatchCartNum = payload => createAction({
  url: API_CART_NUM,
  fetchOptions: {
    showToast: false,
    autoLogin: false
  },
  type: CART_NUM,
  payload
})

/**
 * 购物车推荐
 * @param {*} payload
 */
export const dispatchRecommend = payload => createAction({
  url: API_CART_RECOMMEND,
  type: CART_RECOMMEND,
  payload
})

/**
 * 添加商品到购物车
 * @param {*} payload
 */
export const dispatchAdd = payload => createAction({
  url: API_CART_ADD,
  method: 'POST',
  type: CART_ADD,
  payload
})

/**
 * 更新商品信息
 * @param {*} payload
 */
export const dispatchUpdate = payload => createAction({
  url: API_CART_UPDATE,
  method: 'POST',
  type: CART_UPDATE,
  payload
})

/**
 * 更新商品选中状态
 * @param {*} payload
 */
export const dispatchUpdateCheck = payload => createAction({
  url: API_CART_UPDATE_CHECK,
  method: 'POST',
  type: CART_UPDATE_CHECK,
  payload
})
