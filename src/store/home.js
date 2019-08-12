import {
  API_HOME, API_HOME_SEARCH_COUNT, API_HOME_RECOMMEND, API_HOME_PIN
} from 'constants/api'
import { createAction } from 'utils/redux'

const HOME_INFO = 'HOME_INFO'
const HOME_SEARCH_COUNT = 'HOME_SEARCH_COUNT'
const HOME_PIN = 'HOME_PIN'
const HOME_RECOMMEND = 'HOME_RECOMMEND'


const INITIAL_STATE = {
  homeInfo: {},
  searchCount: 0,
  pin: [],
  recommend: []
}

export const home = function (state = INITIAL_STATE, action) {
  switch(action.type) {
    case HOME_INFO: {
      return {
        ...state,
        homeInfo: action.payload
      }
    }
    case HOME_SEARCH_COUNT: {
      return {
        ...state,
        searchCount: action.payload.count
      }
    }
    case HOME_PIN: {
      // 每3个分成一组
      const pin = []
      action.payload.forEach((item, index) => {
        const groupIndex = parseInt(index / 3)
        if (!pin[groupIndex]) {
          pin[groupIndex] = []
        }
        pin[groupIndex].push(item)
      })
      return { ...state, pin }
    }
    case HOME_RECOMMEND: {
      return {
        ...state,
        recommend: state.recommend.concat(action.payload.rcmdItemList)
      }
    }
    default:
      return state
  }
}


/**
 * 首页数据
 * @param {*} payload
 */
export const dispatchHome = payload => createAction({
  url: API_HOME,
  type: HOME_INFO,
  payload
})

/**
 * 商品总数
 * @param {*} payload
 */
export const dispatchSearchCount = payload => createAction({
  url: API_HOME_SEARCH_COUNT,
  type: HOME_SEARCH_COUNT,
  payload
})

/**
 * 拼团
 * @param {*} payload
 */
export const dispatchPin = payload => createAction({
  url: API_HOME_PIN,
  type: HOME_PIN,
  payload
})

/**
 * 推荐商品
 * @param {*} payload
 */
export const dispatchRecommend = payload => createAction({
  url: API_HOME_RECOMMEND,
  type: HOME_RECOMMEND,
  payload
})
