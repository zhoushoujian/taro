// import { get as getGlobalData } from '../global_data'

const hostname = `https://api.zhoushoujian.com`;
// const hostname = `http://localhost:8000`
// const hostname = `http://192.168.199.162:8000`

export const HTTP_URL = {
  resetPassword: `${hostname}/reset_password`,
  lastSign: `${hostname}/last_sign`,
  goSign: `${hostname}/go_sign`,
  retrieveOthers: `${hostname}/retrieve_others`,
  tokenLogin: `${hostname}/token_login`,
  searchRecord: `${hostname}/search_user_profile?username=`,
  updateUserInfo: hostname + '/update_user_info',
  feedback: hostname + '/feedback',
  miniProgramLogin: hostname + '/mini_program_login',
  getOnlinePersons: hostname + '/get_online_persons',
};
