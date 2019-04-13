import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text, ScrollView } from '@tarojs/components';
import './index.scss';

export default class GoodsList extends Component {

  /**
   * 滚动加载
   */
  handleScroll = () => {
    this.props.onGoodsCall({ type: 'loading' });
  };

  /**
   * 跳转商品详情
   * @param id
   */
  goHref = (id) => {
    this.$preload({ id });
    Taro.navigateTo({
      url: `/pages/goodInfo/index`,
    });
  };

  render() {
    const { goodsList } = this.props;
    return (
      <View className='goodCardWrap'>
        <ScrollView
          className='scrollDom'
          scrollY
          scrollWithAnimation
          lowerThreshold='50'
          onScrollToLower={this.handleScroll}
        >
          {
            Array.isArray(goodsList) && goodsList.length > 0 && goodsList.map((item) => {
              return (
                <View
                  className='botCardItemWrap clearfix'
                  key={item.id}
                  onClick={this.goHref.bind(this, item.id)}
                >
                  <View className='botItemImgWrap left'>
                    <Image src={item.goodPic} />
                  </View>
                  <View className='botItemTxtWrap left'>
                    <View className='txtTop'>
                      <Text className='left'>热销</Text>
                      <Text className='left ellipsis'>{item.name}</Text>
                    </View>
                    <View className='txtMid'>￥{item.price}</View>
                    <View className='txtBot'>销量：10000</View>
                  </View>
                </View>
              );
            })
          }
        </ScrollView>
      </View>
    );
  }
}
