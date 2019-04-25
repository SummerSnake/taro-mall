import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import './index.scss';

export default class BotCard extends Component {
  static defaultProps = {
    botCardObj: {},
  };

  /**
   * 跳转活动列表或商品详情
   * @param type
   * @param id
   */
  goHref = (type, id) => {
    switch (type) {
      case '01':
        this.$preload({ list: this.props.botCardObj.imgList });
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
    const { imgList } = this.props.botCardObj;
    const { title } = this.props.botCardObj;
    return (
      <View className="botCardWrap">
        <View className="botCardTit" onClick={this.goHref.bind(this, '01')}>
          ——<Text>{title}</Text>——
        </View>
        {Array.isArray(imgList) &&
          imgList.map(item => (
            <View
              className="botCardItemWrap clearfix"
              key={item.id}
              onClick={this.goHref.bind(this, '02', item.id)}
            >
              <View className="botItemImgWrap left">
                <Image src={item.goodPic} />
              </View>
              <View className="botItemTxtWrap left">
                <View className="txtTop">
                  <Text className="left">热销</Text>
                  <Text className="left ellipsis">{item.name}</Text>
                </View>
                <View className="txtMid">￥{item.price}</View>
                <View className="txtBot">销量：10000</View>
              </View>
            </View>
          ))}
      </View>
    );
  }
}
