import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Button } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import Loading from '@/components/Loading/index';
import NoData from '@/components/NoData/index';
import './index.scss';

export default class Cart extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      list: [],
      checkboxIds: [],
      totalMoney: 0,
      isSelectAll: false,
    };
  }

  config = {
    navigationBarTitleText: '购物车',
  };

  componentDidShow = async () => {
    this.setState({ isLoading: true });
    // 从缓存中拿当前购买的商品信息
    const goodsList = Taro.getStorageSync('goodsList');
    if (Array.isArray(goodsList) && goodsList.length > 0) {
      const { checkboxIds } = this.state;
      const list = JSON.parse(JSON.stringify(goodsList));
      list.forEach(item => {
        // 存储 checkboxIds 数组供 checkbox 使用
        checkboxIds.push(item.id);
      });
      // 计算总价
      let totalMoney = 0;
      list.forEach(item => {
        totalMoney += parseFloat(item.num) * parseFloat(item.price);
      });
      this.setState({
        list,
        checkboxIds,
        totalMoney: totalMoney.toFixed(2),
        isSelectAll: true,
      });
    }
    this.setState({ isLoading: false });
  };

  /**
   * 商品数量按钮事件
   * @param id
   * @param type
   * @param e
   */
  btnClick = (id, type, e) => {
    e.stopPropagation();
    const { list } = this.state;
    list.forEach(item => {
      if (item.id === id) {
        item.num = type === 'add' ? (item.num += 1) : (item.num -= 1);
        if (item.num < 1) {
          item.num = 0;
        }
      }
    });
    // 计算总价
    let totalMoney = 0;
    list.forEach(item => {
      totalMoney += parseFloat(item.num) * parseFloat(item.price);
    });
    this.setState({
      list,
      totalMoney: totalMoney.toFixed(2),
    });
  };

  /**
   * 商品 checkbox
   * @param id
   * @param e
   */
  checkboxClick = (id, e) => {
    e.stopPropagation();
    const { checkboxIds } = this.state;
    if (checkboxIds.includes(id)) {
      // checkboxIds 数组中是否存在当前点击的 checkbox id
      checkboxIds.splice(checkboxIds.indexOf(id), 1); // 如果有，则删除
    } else {
      checkboxIds.push(id); // 如果 childIds 数组中不存在当前点击的 checkbox id，则将其加入数组
    }
    let flag = true;
    let totalMoney = 0;
    const { list } = this.state;
    list.forEach(item => {
      if (checkboxIds.includes(item.id)) {
        // 计算总价
        totalMoney += parseFloat(item.num) * parseFloat(item.price);
      } else {
        // 全选选择框操作
        flag = false;
      }
    });
    this.setState({
      checkboxIds,
      totalMoney: totalMoney.toFixed(2),
      isSelectAll: flag,
    });
  };

  /**
   * 全选 checkbox
   */
  selectAll = () => {
    const { checkboxIds, list } = this.state;
    if (this.state.isSelectAll) {
      this.setState({
        checkboxIds: [],
        isSelectAll: false,
      });
    } else {
      list.forEach(item => {
        checkboxIds.push(item.id);
      });
      this.setState({
        checkboxIds,
        isSelectAll: true,
      });
    }
  };

  /**
   * 跳转订单页面
   */
  goOrder = () => {
    this.setStore();
    Taro.navigateTo({
      url: '/pages/order/index',
    });
  };

  /**
   * 将商品信息存入缓存
   */
  setStore = () => {
    Taro.removeStorageSync('goodsList');
    const { list } = this.state;
    const arr = [];
    list.forEach(item => {
      arr.push({
        ...item,
      });
    });
    Taro.setStorageSync('goodsList', arr);
  };

  /**
   * 跳转商品详情
   * @param id
   */
  goGoodInfo = id => {
    this.setStore();
    this.$preload({ id });
    Taro.navigateTo({
      url: '/pages/goodInfo/index',
    });
  };

  componentWillUnmount = () => {
    this.setStore();
  };

  render() {
    const { list, checkboxIds, isSelectAll } = this.state;
    return (
      <View className="cartWrap">
        {Array.isArray(list) &&
          list.map(item => (
            <View
              className="cardItemWrap clearfix"
              key={item.id}
              onClick={this.goGoodInfo.bind(this, item.id)}
            >
              <View
                style={{ margin: '28px 10px 0' }}
                className={checkboxIds.includes(item.id) ? 'cardCheckActive' : 'cardCheck'}
                onClick={this.checkboxClick.bind(this, item.id)}
              >
                <View style={{ display: checkboxIds.includes(item.id) ? 'block' : 'none' }}>
                  <AtIcon prefixClass="fa" value="checked" size="16" color="#fff" />
                </View>
              </View>
              <View className="cartItemImgWrap left">
                <Image src={item.goodPic} />
              </View>
              <View className="cartItemTxtWrap left">
                <View className="ellipsis">{item.name}</View>
                <View>￥{item.price}</View>
              </View>
              <View className="btnGroup">
                <View className="subBtn" onClick={this.btnClick.bind(this, item.id, 'sub')}>
                  <AtIcon value="subtract-circle" size="23" color="#999" />
                </View>
                <View className="numDom">{item.num}</View>
                <View className="addBtn" onClick={this.btnClick.bind(this, item.id, 'add')}>
                  <AtIcon value="add-circle" size="23" color="#999" />
                </View>
              </View>
            </View>
          ))}

        <View className="statisticWrap">
          <View
            style={{ margin: '12px 4px 0 8px' }}
            className={isSelectAll ? 'cardCheckActive' : 'cardCheck'}
            onClick={this.selectAll}
          >
            <View style={{ display: isSelectAll ? 'block' : 'none' }}>
              <AtIcon
                style={{ display: isSelectAll ? 'block' : 'none' }}
                prefixClass="fa"
                value="checked"
                size="16"
                color="#fff"
              />
            </View>
          </View>
          <Text className="selectTxt">全选</Text>
          <View className="totalNum">
            合计：<Text>￥{this.state.totalMoney}</Text>
          </View>
          <Button
            className="createOrder right"
            onClick={this.goOrder.bind(this)}
            openType="getUserInfo"
          >
            下单({checkboxIds.length})
          </Button>
        </View>

        <NoData isVisible={Array.isArray(list) && list.length === 0} />

        <Loading isLoading={this.state.isLoading} />
      </View>
    );
  }
}
