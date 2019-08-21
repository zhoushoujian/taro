import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import NavBar from "../../components/navBar"
import { HTTP_URL } from "../../constants/api";
import AutoSuggest from './autoSuggest';
import UserRecordList from './userRecordList';
import "taro-ui/dist/style/components/button.scss";
import './index.scss'


export default class History extends Component {
  constructor(props){
    super(props)
    this.state = {
      recordList: [],
      searchString: "",
      autoSuggestList: [],
      clickShowMoreCount: 1,
      showMoreText: "查看更多"
    }
}

componentDidMount(){

}

searchRecord = (slice=30) => {
  // const username = this.state.searchString ? this.state.searchString : window.$getState().login.username
  //   return searchRecordFunc(username, slice)
  //       .then(result => {
  //   this.signDataCount = result.totalCount
  //           if(this.signDataCount){
  //               result = window._.orderBy(result.signData, ['date'], ['desc'])
  //               this.setState({
  //       recordList: result || [],
  //       showMoreText: "查看更多"
  //     }, () => {
  //       if(this.checkBottomText){
  //         this.checkBottomText = false;
  //         if(this.signDataCount <= (30*this.state.clickShowMoreCount)){
  //           setTimeout(() => {
  //             $(".bottom").css("display", "flex");
  //           })
  //         }
  //       }
  //     })
  //           } else {
  //     this.setState({
  //       recordList: [{date: '无历史记录'}]
  //     })
  //   }
  //       })
}

keyDownEvent = (evt) => {
//     var e = evt;
//     if (e.keyCode === 13) {
//   window.$('.search-input-content')[0].blur();
//   this.setState({
//     clickShowMoreCount: 1
//   })
//         return this.searchRecord()
//     }
}

backToMainPage = () => {

}

// updateValue = (e) => {
//   $('ul').css({
//     "padding": "0",
//     "display": "none"
//   })
//   this.setState({
//     searchString: e.target.value,
//     autoSuggestList: []
//   });
//   const query = e.target.value;
//   if (!query) return;
//   let list = [],
//     self = this,
//     timer;
//   if (timer) clearTimeout(timer);
//   timer = setTimeout(function () {
//     getAutoSuggest();
//   }, 200);

//   function getAutoSuggest() {
//     axios.get(HTTP_URL.signRecordTypeahead.format({
//         query
//       }))
//       .then((msg) => {
//         if (msg.data.status == "SUCCESS" && msg.data.result.length) {
//           logger.info("signRecordTypeahead result", msg.data.result)
//           $.each(msg.data.result, function (index, ele) {
//             list.push(ele);
//           });
//           self.setState({
//             autoSuggestList: list
//           }, () => {
//             $('ul').css({
//               "padding": "4px 8px",
//               "display": "block"
//             })
//           })
//         } else {
//           if (!msg.data.result.length) {
//             self.setState({
//               autoSuggestList: list
//             }, () => {
//               $('ul').css({
//                 "padding": "0",
//                 "display": "none"
//               })
//             })
//             return;
//           }
//           alert(msg.data)
//         }
//       })
//       .catch(err => {
//         logger.error("getAutoSuggest error", err.stack || err.toString())
//       })
//   }
// }

// blur = () => {
// //  hack first auto suggest is not clickable
// setTimeout(() => {
//   $('ul').css({"padding": "0", "display": "none"})
// }, 300)
// }

click = () => {
// $('ul').css({"padding": "4px 8px", "display": "block"})
}

select = (item) => {
  // $('ul').css({
  //   "padding": "0",
  //   "display": "none"
  // })
  // this.setState({
  //   searchString: item,
  //   clickShowMoreCount: 1
  // }, this.searchRecord);
}

showMore = () => {
  // let {
  //   clickShowMoreCount
  // } = this.state;
  // this.setState({
  //   clickShowMoreCount: ++clickShowMoreCount,
  //   showMoreText: "正在查询..."
  // }, () => this.searchRecord(clickShowMoreCount * 30))
  // this.checkBottomText = true;
}

goBack = () => {
  Taro.navigateTo({
    url: '/pages/user/user'
  })
}

render(){
  let { recordList, searchString, autoSuggestList, clickShowMoreCount, showMoreText } = this.state;
  let recordListLength = recordList.length;
    return (
      <View className="search-history-container">
        <NavBar centerText="查询签到历史" backFun={this.goBack} ></NavBar>
        <View className="search-header">
          <View className="search-input">
            <Input className="search-input-content"  id="search-history" value={searchString} autoComplete="off" placeholder={"请输入您要搜索的用户名"}
              onClick={this.click} onBlur={this.blur}  onKeyDown={(event) => this.keyDownEvent(event)} onChange={this.updateValue}/>
            <View className="ul">
              {autoSuggestList.length ? autoSuggestList.map((item, key) => <AutoSuggest key={key} item={item} query={searchString} select={this.select} />) : null}
            </View>
          </View>
          <View className="search-button" onClick={() => {
            this.setState({
              clickShowMoreCount: 1
            })
            return this.searchRecord()
          }}>
            <AtButton type="primary" className="button" value="搜索">搜索</AtButton>
          </View>
        </View>
        <View className="record-list-container">
          {recordListLength ? recordList.map((item, index) => <UserRecordList item={item} key={index}/>)  : null}
          {this.signDataCount > (30*clickShowMoreCount)
            ? <Text className="show-more" onClick={this.showMore}>{showMoreText}</Text>
            : <View className="show-more bottom"><Text>______________</Text>我是有底线的<Text>______________</Text></View>}
        </View>
      </View>
    )
  }
};

