import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import './index.scss';

export default class IconList extends Component {
  constructor() {
    super(...arguments);
    this.state = {};
  }

  /**
   * 跳转商品列表
   * @param iconId
   */
  goGoodList = (iconId) => {
    this.$preload({ iconId });
    Taro.navigateTo({
      url: `/pages/category/index`
    });
  };

  render() {
    const { iconList } = this.props;
    return (
        <View className='iconList'>
          {
            Array.isArray(iconList) && iconList.length > 0 && iconList.map((icon) => {
              return (
                <View className='iconItem' key={icon.id} onClick={this.goGoodList.bind(this, icon.id)}>
                  <View className='iconWrap'>
                    <Image className='iconImg' src={icon.imgUrl} />
                  </View>
                  <View className='iconTitle'>{icon.title}</View>
                </View>
              );
            })
          }
        </View>
    );
  }
}
