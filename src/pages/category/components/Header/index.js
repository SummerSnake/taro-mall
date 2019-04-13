import Taro, { Component } from '@tarojs/taro';
import { View, Input, Text, Image } from '@tarojs/components';
import './index.scss';

export default class Header extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      isVisible: true,
      isReverse: '',
      inputVal: '',
    };
  }

  /**
   * 监听搜索框
   */
  inputValChange = (e) => {
    this.setState({
      inputVal: e.detail.value,
    });
  };

  /**
   * 点击搜索
   */
  handleSearch = () => {
    this.props.onHeaderCall({
      pdFullName: this.state.inputVal,
    });
  };

  /**
   * 搜索框获取焦点
   */
  handleFocus = () => {
    this.setState({
      isVisible: false,
    });
  };

  /**
   * 搜索框失去焦点
   */
  handleBlur = () => {
    this.setState({
      isVisible: true,
    });
  };

  /**
   * 点击排序
   * @param type
   */
  sortFunc = (type) => {
    this.setState({
      isReverse: type,
    });
    this.props.onHeaderCall({
      searchVal: this.state.inputVal,
      type,
    });
  };

  render() {
    const { inputVal, isVisible, isReverse } = this.state;
    return (
      <View className='cateHeader'>
        <View className='searchDom clearfix'>
          <Input
            className='inputDom'
            placeholder-class='placeClass'
            placeholder='请输入商品名称'
            value={inputVal}
            onInput={this.inputValChange.bind(this)}
            onFocus={this.handleFocus.bind(this)}
            onBlur={this.handleBlur.bind(this)}
          />
          <Image
            className='imgDom'
            style={{ display: (isVisible && inputVal === '') ? 'block' : 'none' }}
            src='https://gitee.com/summersnake/images/raw/master/others/search_icon.png'
          />
          <Text onClick={this.handleSearch}>搜索</Text>
        </View>
        <View className='sortDom'>
          <View className='sortItem' onClick={this.sortFunc.bind(this, 0)}>
            <Text>综合</Text>
            <Image
              src='https://gitee.com/summersnake/images/raw/master/others/arrow_down.png'
              className={isReverse === 0 ? 'sortImgReverse' : 'sortImg'}
            />
          </View>
          <View className='sortItem' onClick={this.sortFunc.bind(this, 1)}>
            <Text>销量</Text>
            <Image
              src='https://gitee.com/summersnake/images/raw/master/others/arrow_down.png'
              className={isReverse === 1 ? 'sortImgReverse' : 'sortImg'}
            />
          </View>
          <View className='sortItem' onClick={this.sortFunc.bind(this, 2)}>
            <Text>价格</Text>
            <Image
              src='https://gitee.com/summersnake/images/raw/master/others/arrow_down.png'
              className={isReverse === 2 ? 'sortImgReverse' : 'sortImg'}
            />
          </View>
        </View>
      </View>
    );
  }
}
