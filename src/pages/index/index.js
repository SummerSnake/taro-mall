import Taro, { Component } from '@tarojs/taro';
import { View, Image, Swiper, SwiperItem } from '@tarojs/components';
// import { AtIcon } from 'taro-ui';
import { connect } from '@tarojs/redux';
import Loading from '../../components/Loading/index';
import GlobalFooter from '../../components/GlobalFooter/index';
import './index.scss';

@connect(({ home, loading }) => ({
  ...home,
  ...loading,
}))

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页',
    navigationBarBackgroundColor: 'black',
    navigationBarTextStyle: "white",
  };

  componentDidMount = () => {
    this.props.dispatch({
      type: 'home/load',
    });
  };

  render() {
    const { imgList } = this.props;
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
                  <Image mode='widthFix' src={img.imgUrl} />
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
