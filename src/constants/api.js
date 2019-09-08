// import { get as getGlobalData } from '../global_data'

const hostname = `http://94.191.67.225:8000`
// const hostname = `http://localhost:8000`
// const hostname = `http://192.168.199.162:8000`

export const HTTP_URL = {
	"resetPassword": `${hostname}/reset_password`,
	"loginVerify": `${hostname}/login_verify`,
	"registerVerify": `${hostname}/register_verify`,
	"lastSign": `${hostname}/last_sign`,
	"goSign": `${hostname}/go_sign`,
	"retrieveOthers": `${hostname}/retrieve_others`,
	"tokenLogin": `${hostname}/token_login`,
	"searchRecord": `${hostname}/search_user_profile\?username=`,
	"updateUserInfo": hostname + '/update_user_info',
	"feedback": hostname + '/feedback',
	"getLicence": hostname + "/get_licence\?callTaro=1",
	"getPrivacy": hostname + "/get_privacy",
	"getServiceList": hostname + "/get_service_list",
	"getUserAgreement": hostname + "/get_user_agreement",
	"heartBeat": hostname + "/heart_beat",
  "replaceSocketLink": hostname + "/replace_socket_link",
  "weiXinLogin": hostname + "/wei_xin_login",
  "addClientOrigin": hostname + "/add_client_origin",
  miniProgramLogin: hostname + "/mini_program_login"
}
