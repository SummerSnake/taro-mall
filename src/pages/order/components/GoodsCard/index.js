import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import './index.scss';

export default class Gift extends Component {
  constructor() {
    super(...arguments);
    this.state = {};
  }

  /**
   * 跳转商品详情
   * @param id
   */
  goGoodInfo = id => {
    this.$preload({ id });
    Taro.navigateTo({
      url: `/pages/goodInfo/index`,
    });
  };

  render() {
    const { goodsList } = this.props;
    return (
      <View className="goodsCard">
        {Array.isArray(goodsList) &&
          goodsList.length > 0 &&
          goodsList.map(good => {
            return (
              <View
                className="goodWrap"
                key={good.id}
                onClick={this.goGoodInfo.bind(this, good.id)}
              >
                <View className="goodImgWrap">
                  <Image className="goodImg" src={good.goodsPictures} />
                </View>
                <View className="goodTxtWrap">
                  <View className="txtTop">
                    <Text>{good.goodsBrandName}</Text>
                    <Text>{good.pdFullName}</Text>
                  </View>
                  <View className="txtMidOne">
                    <Text>{good.pdTypeName}</Text>
                    <Text>
                      {good.pdSpec}
                      {good.basicUnitName}/{good.salesUnitName}
                    </Text>
                  </View>
                  <View className="txtMidTwo">
                    <Text>￥{good.sellingPrice}</Text>
                    <Text className="midLast">￥{good.originalPrice}</Text>
                  </View>
                  <View className="txtMidBot">
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
