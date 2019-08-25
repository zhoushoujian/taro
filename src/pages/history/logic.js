import { HTTP_URL } from "../../constants/api";
import { networkErr, fetch } from "../../utils/utils"

export const searchRecordFunc = (username, slice) => {
  if (!username) return Promise.resolve();
  console.info("userClick searchString", username);
  return fetch(HTTP_URL.searchRecord + username, JSON.stringify({payload: slice}))
    .then(response => {
      console.info("searchRecord  response.data", response.data);
      return Promise.resolve(response.data.result);
    })
    .catch(err => {
      networkErr(err);
    })
}
