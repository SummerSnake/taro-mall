import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import './index.scss';

export default class MidCard extends Component {
  constructor() {
    super(...arguments);
    this.state = {};
  }

  /**
   * 跳转活动列表或商品详情
   * @param type
   * @param id
   */
  // goHref = (type, id) => {
  //   switch (type) {
  //     case '01':
  //       Taro.navigateTo({
  //         url: `/pages/activity/index`
  //       });
  //       break;
  //     case '02':
  //       this.$preload({ id });
  //       Taro.navigateTo({
  //         url: `/pages/goodInfo/index`
  //       });
  //       break;
  //     default:
  //   }
  // };

  render() {
    const { imgList } = this.props.midCardObj || [];
    const { picture, title } = this.props.midCardObj || '';
    Array.isArray(imgList) && imgList.length > 0 && imgList.splice(4);
    return (
      <View className='midCardWrap'>
        <View className='midCardTit' onClick={this.goHref.bind(this, '01')}>{title}
          <View className='moreArrow'>
            <Text>更多</Text>
            <Image
              className='moreArrowImg'
              src='https://gitee.com/summersnake/images/raw/master/others/arrow_right.png'
            />
          </View>
        </View>
        <View className='midCardBanner'>
          <Image src={picture} />
        </View>
        <View className='midItemWrap'>
          {
            imgList.map((item) => {
              return (
                <View
                  className='midItemDom'
                  key={item.id}
                  onClick={this.goHref.bind(this, '02', item.id)}
                >
                  <View className='midItemImgWrap'>
                    <Image src={item.goodPic} />
                    <View className='midImgBot'>
                      <Text>热销</Text>
                      <Text>{item.name}</Text>
                    </View>
                  </View>
                  <View className='midItemTxtWrap'>
                    <View className='txtTop'>￥{item.price}</View>
                    <View className='txtBot'>销量：1000</View>
                  </View>
                </View>
              );
            })
          }
        </View>
      </View>
    );
  }
}
