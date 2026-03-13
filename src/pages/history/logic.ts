import { HTTP_URL } from "../../constants/api";
import { networkErr, request } from "../../utils/utils"

export const searchRecordFunc = (username, slice) => {
  if (!username) return Promise.resolve();
  console.info("userClick searchString", username);
  return request(HTTP_URL.searchRecord + username + '&slice=' + slice)
    .then(response => {
      console.info("searchRecord  response.data", response.data);
      return Promise.resolve(response.data.result);
    })
    .catch(err => {
      networkErr(err);
    })
}
