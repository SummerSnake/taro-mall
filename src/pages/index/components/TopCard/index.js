import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import './index.scss';

export default class TopCard extends Component {

  static defaultProps = {
    topCardObj: {},
  };

  /**
   * 跳转活动列表或商品详情
   * @param type
   * @param id
   */
  goHref = (type, id) => {
    switch (type) {
      case '01':
        Taro.navigateTo({
          url: `/pages/activity/index`
        });
        break;
      case '02':
        this.$preload({ id });
        Taro.navigateTo({
          url: `/pages/goodInfo/index`
        });
        break;
      default:
    }
  };

  render() {
    const { imgList } = this.props.topCardObj;
    const { picture, title } = this.props.topCardObj;
    Array.isArray(imgList) && imgList.length > 0 && imgList.splice(2);
    return (
      <View className='topCardWrap'>
        <View className='topCardTit' onClick={this.goHref.bind(this, '01')}>{title}
          <View className='moreArrow right'>
            <Text>更多</Text>
            <Image className='moreArrowImg'
              src='https://gitee.com/summersnake/images/raw/master/others/arrow_right.png'
            />
          </View>
        </View>
        <View className='topCardBanner'>
          <Image src={picture} />
        </View>
        <View className='topItemWrap'>
          {
            imgList.map((item) => {
              return (
                <View
                  className='topItemDom'
                  key={item.id}
                  onClick={this.goHref.bind(this, '02', item.id)}
                >
                  <View className='topItemImgWrap'>
                    <Image src={item.goodPic} />
                  </View>
                  <View className='topItemTxtWrap'>
                    <View className='txtTop'>
                      <Text className='left'>热销</Text>
                      <Text className='left ellipsis'>{item.name}</Text>
                    </View>
                    <View className='txtMid'>￥{item.price}</View>
                    <View className='txtBot'>销量：100</View>
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
