import { Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Component } from 'react';
import { connect } from 'react-redux';
import NavBar from '../../components/navBar';
import { HTTP_URL } from '../../constants/api';
import { updateOnlinePersonsName } from '../../store/home';
import { networkErr, request } from '../../utils/utils';
import './index.scss';

@connect((state) => state.home, { updateOnlinePersonsName })
export default class ShowOnlinePersons extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      onlinePersonsName: [],
      isSearching: true,
    };
  }

  componentDidMount() {
    return request(HTTP_URL.getOnlinePersons)
      .then((response) => {
        const result = response.data.result;
        this.setState({
          onlinePersonsName: result.response,
          isSearching: false,
        });
        this.props.updateOnlinePersonsName(result);
      })
      .catch(function (error) {
        networkErr(error);
        this.setState({
          isSearching: false,
        });
      });
  }

  backToMainPage = () => {
    Taro.navigateTo({
      url: '/pages/home/home',
    });
  };

  render() {
    const { onlinePersonsName, isSearching } = this.state;
    return (
      <View className='online-persons-name-container'>
        <NavBar centerText='在线成员' backFun={this.backToMainPage} />
        <View className='online-persons-name-content'>
          {isSearching ? (
            <Text className='searching'>正在查询...</Text>
          ) : (
            onlinePersonsName.map((item, index) => (
              <Text key={item.username} className={item.origin || 'h5'}>
                {item.username + (index === onlinePersonsName.length - 1 ? '' : `, `)}
              </Text>
            ))
          )}
        </View>
      </View>
    );
  }
}
