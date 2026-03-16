import { Image, View } from '@tarojs/components';
import { Component } from 'react';
import loading from './assets/loading.gif';
import './index.scss';

export default class Loading extends Component {
  render() {
    return (
      <View className='comp-loading'>
        <Image src={loading} className='comp-loading__img' />
      </View>
    );
  }
}
