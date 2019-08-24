import { HTTP_URL } from "../../constants/api";
import { networkErr } from "../common/logic";

export const searchRecordFunc = (username, slice) => {
  if (!username) return Promise.resolve();
  window.logger.info("userClick searchString", username);
  return axios.get(HTTP_URL.searchRecord + username + '&slice=' + slice)
    .then(response => {
      window.logger.info("searchRecord  response.data", response.data);
      return Promise.resolve(response.data.result);
    })
    .catch(err => {
      networkErr(err);
    })
}
