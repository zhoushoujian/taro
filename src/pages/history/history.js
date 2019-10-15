import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, Button } from '@tarojs/components'
import _ from "lodash"
import NavBar from "../../components/navBar"
import { connect } from '@tarojs/redux'
import { searchRecordFunc } from './logic'
import './index.scss'

@connect(state => state.login, { })
export default class History extends Component {

  config = {
    navigationBarTitleText: '查询签到历史'
  }

  constructor(props){
    super(props)
    this.state = {
      recordList: [],
      searchString: this.props.username || "",
      clickShowMoreCount: 1,
      showMoreText: "查看更多"
    }
}

searchRecord = (slice = 30) => {
  const username = this.state.searchString;
  return searchRecordFunc(username, slice)
    .then(result => {
      if(!result) {
        this.setState({
          recordList: [{
            date: '无历史记录'
          }]
        })
        return;
      }
      this.signDataCount = result.totalCount
      if (this.signDataCount) {
        result = _.orderBy(result.signData, ['date'], ['desc'])
        this.setState({
          recordList: result || [],
          showMoreText: "查看更多"
        })
      } else {
        this.setState({
          recordList: [{
            date: '无历史记录'
          }]
        })
      }
    })
}

keyDownEvent = (evt) => {
  var e = evt;
  if (e.keyCode === 13) {
    this.setState({
      clickShowMoreCount: 1
    })
    return this.searchRecord()
  }
}


updateValue = (e) => {
  this.setState({
    searchString: e.target.value
  });
}

showMore = () => {
  let {
    clickShowMoreCount
  } = this.state;
  this.setState({
    clickShowMoreCount: ++clickShowMoreCount,
    showMoreText: "正在查询..."
  }, () => this.searchRecord(clickShowMoreCount * 30))
}

goBack = () => {
  Taro.navigateTo({
    url: '/pages/user/user'
  })
}

render(){
  let { recordList, searchString, clickShowMoreCount, showMoreText, showBottom } = this.state;
  let recordListLength = recordList.length;
    return (
      <View className="search-history-container">
        <NavBar centerText="查询签到历史" backFun={this.goBack} ></NavBar>
        <View className="search-header">
          <View className="search-input">
            <Input className="search-input-content"  id="search-history" value={searchString} autoComplete="off" placeholder="搜索用户名"
              onKeyDown={(event) => this.keyDownEvent(event)} onChange={this.updateValue}/>
          </View>
          <View className="search-button" onClick={() => {
            this.setState({
              clickShowMoreCount: 1
            })
            return this.searchRecord()
          }}>
            <Button type="default" className="button" value="搜索">搜索</Button>
          </View>
        </View>
        <View className="record-list-container">
          {recordListLength ? recordList.map((item) => <View className="record-container" key={item.date}>
            <Text className="date-record">{item.date}</Text>
            <Text className="location-record">{item.location}</Text>
            </View>) : null}
          {this.signDataCount > (30*clickShowMoreCount)
            ? <Text className="show-more" onClick={this.showMore}>{showMoreText}</Text>
            : null}
        </View>
      </View>
    )
  }
};

