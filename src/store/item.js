import { API_ITEM, API_ITEM_RECOMMEND } from '@constants/api'
import { createAction } from '@utils/redux'

const ITEM_INFO = 'ITEM_INFO'
const ITEM_RECOMMEND = 'ITEM_RECOMMEND'

const INITIAL_STATE = {
  itemInfo: {}
}

export const item = function (state = INITIAL_STATE, action) {
  switch(action.type) {
    case ITEM_INFO: {
      return {
        ...state,
        itemInfo: action.payload
      }
    }
    case ITEM_RECOMMEND: {
      return { ...state }
    }
    default:
      return state
  }
}


/**
 * 首页数据
 * @param {*} payload
 */
export const dispatchItem = payload => createAction({
  url: API_ITEM,
  type: ITEM_INFO,
  payload
})

/**
 * 推荐商品
 * @param {*} payload
 */
export const dispatchItemRecommend = payload => createAction({
  url: API_ITEM_RECOMMEND,
  type: ITEM_RECOMMEND,
  payload
})
