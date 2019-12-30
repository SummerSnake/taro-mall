import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import './index.scss';

class GoodsCard extends Component {
  /**
   * 跳转商品详情
   * @param id
   */
  goGoodInfo = id => {
    this.$preload({ id });
    Taro.navigateTo({
      url: '/pages/goodInfo/index',
    });
  };

  render() {
    const { goodsList } = this.props;
    return (
      <View className="goodsCard">
        {Array.isArray(goodsList) &&
          goodsList.map(good => {
            return (
              <View
                className="goodWrap clearfix"
                key={good.id}
                onClick={this.goGoodInfo.bind(this, good.id)}
              >
                <View className="goodImgWrap left">
                  <Image src={good.goodPic} />
                </View>
                <View className="goodTxtWrap left">
                  <View className="txtTop">{good.name}</View>
                  <View className="txtBottom">￥{good.price}</View>
                  <View className="txtRight right">
                    x<Text>{good.num}</Text>
                  </View>
                </View>
              </View>
            );
          })}
      </View>
    );
  }
}

export default GoodsCard;
