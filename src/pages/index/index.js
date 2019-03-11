import Taro, { Component } from '@tarojs/taro';
import { View, Image, Swiper, SwiperItem } from '@tarojs/components';
// import { AtIcon } from 'taro-ui';
import Loading from '../../components/Loading/index';
import GlobalFooter from '../../components/GlobalFooter/index';
// import { postRequest } from '../../utils/api';
import './index.less';

export default class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      fetchData: {
        isLoading: false,
        imgList: []
      },
    };
  }

  config = {
    navigationBarTitleText: '首页',
    navigationBarBackgroundColor: '#000',
    navigationBarTextStyle: "white",
  };

  render() {
    const { imgList } = this.state.fetchData;
    return (
      <View className='homeWrap'>
        <Swiper
          indicatorColor='#999'
          indicatorActiveColor='#fff'
          circular
          indicatorDots
          autoplay
        >
          {
            Array.isArray(imgList) && imgList.length > 0 && imgList.map((img) => {
              return (
                <SwiperItem key={img.id}>
                  <Image className='slideImg' src={img.imgUrl} />
                </SwiperItem>
              );
            })
          }
        </Swiper>

        <View className='iconfont icon-more arrow' />

        <Loading isLoading={this.state.isLoading} />

        <GlobalFooter isActive='01' />
      </View>
    );
  }
}
