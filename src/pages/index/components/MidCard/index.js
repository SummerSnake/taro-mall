import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import './index.scss';

class MidCard extends Component {
  static defaultProps = {
    midCardObj: {},
  };

  /**
   * 跳转活动列表或商品详情
   * @param type
   * @param id
   */
  goHref = (type, id) => {
    switch (type) {
      case '01':
        this.$preload({ list: this.props.midCardObj.imgList });
        Taro.navigateTo({
          url: '/pages/activity/index',
        });
        break;
      case '02':
        this.$preload({ id });
        Taro.navigateTo({
          url: '/pages/goodInfo/index',
        });
        break;
      default:
    }
  };

  render() {
    const { imgList } = this.props.midCardObj;
    const { picture, title } = this.props.midCardObj;
    Array.isArray(imgList) && imgList.length > 0 && imgList.splice(4);
    return (
      <View className="midCardWrap">
        <View className="midCardTit" onClick={this.goHref.bind(this, '01')}>
          {title}
          <View className="moreArrow right">
            <Text>更多</Text>
            <Image className="moreArrowImg" src="https://s1.ax1x.com/2020/06/01/tGtBsU.png" />
          </View>
        </View>
        <View className="midCardBanner left">
          <Image src={picture} />
        </View>
        <View className="midItemWrap clearfix">
          {imgList.map((item) => (
            <View
              className="midItemDom left"
              key={item.id}
              onClick={this.goHref.bind(this, '02', item.id)}
            >
              <View className="midItemImgWrap">
                <Image src={item.goodPic} />
                <View className="midImgBot">
                  <Text>热销</Text>
                  <Text className="ellipsis">{item.name}</Text>
                </View>
              </View>
              <View className="midItemTxtWrap">
                <View className="txtTop">￥{item.price}</View>
                <View className="txtBot">销量：1000</View>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }
}

export default MidCard;
