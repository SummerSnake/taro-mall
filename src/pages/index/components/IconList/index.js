import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import './index.scss';

export default class IconList extends Component {

  /**
   * 跳转商品列表
   * @param iconId
   */
  goGoodList = (iconId) => {
    this.$preload({ iconId });
    Taro.navigateTo({
      url: '/pages/category/index',
    });
  };

  render() {
    const { iconList } = this.props;
    return (
      <View className='iconList clearfix'>
        {
          Array.isArray(iconList) && iconList.map(icon => (
            <View className='iconItem left' key={icon.id} onClick={this.goGoodList.bind(this, icon.id)}>
              <View className='iconWrap'>
                <Image src={icon.imgUrl} />
              </View>
              <View className='iconTitle'>{icon.title}</View>
            </View>
          ))
        }
      </View>
    );
  }
}
