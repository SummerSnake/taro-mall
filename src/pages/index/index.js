import Taro, { Component } from '@tarojs/taro';
import { View, Image, Swiper, SwiperItem } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import Loading from '@/components/Loading/index';
import GlobalFooter from '@/components/GlobalFooter/index';
import IconList from './components/IconList/index';
import TopCard from './components/TopCard/index';
import MidCard from './components/MidCard/index';
import BotCard from './components/BotCard/index';
import './index.scss';

@connect(({ home, loading }) => ({
  ...home,
  ...loading,
}))

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页',
  };

  componentDidMount = () => {
    this.props.dispatch({
      type: 'home/load',
    });
  };

  render() {
    const { imgList, iconList, topCardObj, midCardObj, botCardObj, effects } = this.props;
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
                  <Image src={img.imgUrl} />
                </SwiperItem>
              );
            })
          }
        </Swiper>

        <IconList iconList={iconList} />

        <TopCard topCardObj={topCardObj} />

        <MidCard midCardObj={midCardObj} />

        <BotCard botCardObj={botCardObj} />

        <Loading isLoading={effects['home/load']} />

        <GlobalFooter isActive='01' />
      </View>
    );
  }
}
