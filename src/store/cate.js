import { API_CATE, API_CATE_SUB, API_CATE_SUB_LIST } from '@constants/api'
import { createAction } from '@utils/redux'

const CATE_MENU = 'CATE_MENU'
const CATE_SUB = 'CATE_SUB'
const CATE_SUB_LIST = 'CATE_SUB_LIST'


const INITIAL_STATE = {
  menu: [],
  category: [],
  subMenu: [],
  subCategory: {}
}

export const cate = function (state = INITIAL_STATE, action) {
  switch(action.type) {
    case CATE_MENU: {
      const { categoryList } = action.payload
      const menu = categoryList.map(({ id, name }) => ({ id, name }))
      return { ...state, menu, category: categoryList }
    }
    case CATE_SUB: {
      return {
        ...state,
        subMenu: action.payload.category.subCategoryList
      }
    }
    case CATE_SUB_LIST: {
      const { id, itemList } = action.payload
      return {
        ...state,
        subCategory: { ...state.subCategory, [id]: itemList }
      }
    }
    default:
      return state
  }
}

/**
 * 分类菜单、列表
 * @param {*} payload
 */
export const dispatchMenu = payload => createAction({
  url: API_CATE,
  type: CATE_MENU,
  payload
})

/**
 * 子级菜单
 * @param {*} payload
 */
export const dispatchSubMenu = payload => createAction({
  url: API_CATE_SUB,
  type: CATE_SUB,
  payload
})

/**
 * 子级列表
 * @param {*} payload
 */
export const dispatchSubList = payload => createAction({
  url: API_CATE_SUB_LIST,
  type: CATE_SUB_LIST,
  cb: res => ({ ...res, id: payload.categoryL2Id }),
  payload
})
