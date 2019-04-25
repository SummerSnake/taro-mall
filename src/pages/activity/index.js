import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import './index.scss';

export default class Activity extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      goodsList: [],
    };
  }

  config = {
    navigationBarTitleText: '活动',
  };

  componentDidMount = () => {
    const { list } = this.$router.preload;
    if (Array.isArray(list)) {
      this.setState({ goodsList: list });
    }
  };

  /**
   * 跳转商品详情
   * @param id
   */
  goHref = id => {
    this.$preload({ id });
    Taro.navigateTo({
      url: '/pages/goodInfo/index',
    });
  };

  render() {
    const { goodsList } = this.state;
    return (
      <View className="activityWrap">
        <View className="topItemWrap">
          {Array.isArray(goodsList) &&
            goodsList.map(item => (
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
      </View>
    );
  }
}
