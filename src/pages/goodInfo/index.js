import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Button } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import { connect } from '@tarojs/redux';
import Loading from '@/components/Loading/index';
import './index.scss';

@connect(({ goodInfo, loading }) => ({
  ...goodInfo,
  ...loading,
}))
class GoodInfo extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      currentTab: 0,
      totalNum: 0,
      totalMoney: 0,
    };
  }

  config = {
    navigationBarTitleText: '商品详情',
  };

  componentDidMount = async () => {
    this.props.dispatch({
      type: 'goodInfo/save',
      payload: {
        goodId: this.$router.preload.id,
      },
    });
    await this.props.dispatch({
      type: 'goodInfo/load',
    });
    // 挂载时获取缓存中的商品信息
    const goodsList = Taro.getStorageSync('goodsList');
    if (goodsList && goodsList.length > 0) {
      const list = JSON.parse(JSON.stringify(goodsList));
      list.forEach((item) => {
        if (item.id === this.$router.preload.id) {
          this.setState({
            totalNum: item.num,
            totalMoney: (item.num * this.props.goodInfo.price).toFixed(2),
          });
        }
      });
    }
  };

  /**
   * 商品数量按钮事件
   * @param type
   */
  btnClick = (type) => {
    let num = this.state.totalNum;
    num = type === 'add' ? (num += 1) : (num -= 1);
    if (num < 1) {
      num = 0;
    }
    let money = this.props.goodInfo.price;
    this.setState({
      totalNum: num,
      totalMoney: (money * num).toFixed(2),
    });
  };

  /**
   * tab 点击事件
   * @param value
   */
  handleTabClick = (value) => {
    this.setState({
      currentTab: value,
    });
  };

  /**
   * 将商品信息存入缓存
   */
  setStore = () => {
    // 将购买的商品 id, 数量 存到缓存中
    if (this.state.totalNum > 0) {
      // 如果缓存中存在 goodsList 字段
      const goodsList = Taro.getStorageSync('goodsList');
      if (goodsList && goodsList.length > 0) {
        const list = JSON.parse(JSON.stringify(goodsList));
        let flag = true;
        list.forEach((item) => {
          // 如果缓存在该商品，则添加数量
          if (item.id === this.props.goodInfo.id) {
            item.num = this.state.totalNum;
            flag = false;
          }
        });
        if (flag) {
          list.push({
            // 如果缓不存在该商品，则加入缓存
            ...this.props.goodInfo,
            num: this.state.totalNum,
          });
        }
        Taro.setStorageSync('goodsList', list);
      } else {
        // 如果不存在，则将商品 id 数量 存入缓存中
        let timeStamp = Date.parse(new Date()) + 2592000000;
        Taro.setStorageSync('goodsList', [
          {
            ...this.props.goodInfo,
            num: this.state.totalNum,
          },
        ]);
        Taro.setStorageSync('expiration', timeStamp);
      }
    }
  };

  /**
   * 跳转页面
   * @param type
   */
  goHref = (type) => {
    switch (type) {
      case '01':
        Taro.switchTab({
          url: '/pages/index/index',
        });
        break;
      case '02':
        Taro.switchTab({
          url: '/pages/category/index',
        });
        break;
      case '03':
        this.setStore();
        Taro.switchTab({
          url: '/pages/cart/index',
        });
        break;
      case '04':
        this.setStore();
        Taro.navigateTo({
          url: '/pages/order/index',
        });
        break;
      default:
        Taro.switchTab({
          url: '/pages/index/index',
        });
    }
  };

  componentWillUnmount = () => {
    this.setStore();
  };

  render() {
    const { goodInfo, effects } = this.props;
    const { currentTab } = this.state;
    return (
      <View className="goodsInfoWrap">
        <View className="bannerWrap">
          <Image src={goodInfo.goodPic} />
        </View>

        <View className="infoTxtWrap">
          <View className="txtTop">
            <Text className="ellipsis">{goodInfo.name}</Text>
          </View>
          <View className="txtBottom">
            <Text>￥{goodInfo.price}</Text>
            <Text className="bottomLast">￥{goodInfo.price}</Text>
          </View>
          <View className="txtRight right">
            <Text>库存：9999</Text>
            <Text>销量：9999</Text>
          </View>
        </View>

        <View className="numWrap">
          <View className="totalMoney">
            合计：<Text>{this.state.totalMoney}</Text>
          </View>
          <View className="btnGroup right">
            <View className="subBtn" onClick={this.btnClick.bind(this, 'sub')}>
              <AtIcon value="subtract-circle" size="20" color="#999" />
            </View>
            <View className="totalNum">{this.state.totalNum}</View>
            <View className="addBtn" onClick={this.btnClick.bind(this, 'add')}>
              <AtIcon value="add-circle" size="20" color="#999" />
            </View>
          </View>
        </View>

        <View className="tabsWrap">
          <View className="tabsHeader">
            <View>
              <Text
                className={currentTab === 0 ? 'tabTagActive' : 'tabTag'}
                onClick={this.handleTabClick.bind(this, 0)}
              >
                商品描述
              </Text>
            </View>
            <View>
              <Text
                className={currentTab === 1 ? 'tabTagActive' : 'tabTag'}
                onClick={this.handleTabClick.bind(this, 1)}
              >
                规格参数
              </Text>
            </View>
            <View>
              <Text
                className={currentTab === 2 ? 'tabTagActive' : 'tabTag'}
                onClick={this.handleTabClick.bind(this, 2)}
              >
                包装售后
              </Text>
            </View>
          </View>

          <View className="tabsCon">
            <Image
              mode="widthFix"
              src={
                currentTab === 0
                  ? goodInfo.goodPic
                  : currentTab === 1
                  ? 'https://s1.ax1x.com/2020/06/01/tGtWz6.jpg'
                  : 'https://s1.ax1x.com/2020/06/01/tGt4sO.jpg'
              }
            />
          </View>
        </View>

        <View className="goodInfoBottom">
          <View className="bottomIconWrap">
            <View className="bottomIcon">
              <AtIcon value="home" size="21" color="#666" onClick={this.goHref.bind(this, '01')} />
              <View className="iconTxt">首页</View>
            </View>
            <View className="bottomIcon" onClick={this.goHref.bind(this, '02')}>
              <AtIcon value="bullet-list" size="21" color="#666" />
              <View className="iconTxt">分类</View>
            </View>
            <View className="bottomIcon" onClick={this.goHref.bind(this, '03')}>
              <View
                className="badgeDom"
                style={{ display: this.state.totalNum > 0 ? 'block' : 'none' }}
              >
                {this.state.totalNum}
              </View>
              <AtIcon value="shopping-cart" size="21" color="#666" />
              <View className="iconTxt">购物车</View>
            </View>
          </View>
          <View className="botBtnWrap">
            <View className="addToCart" onClick={this.btnClick.bind(this, 'add')}>
              加入购物车
            </View>
            <Button className="goPay" onClick={this.goHref.bind(this, '04')}>
              去结算
            </Button>
          </View>
        </View>

        <Loading isLoading={effects['goodInfo/load']} />
      </View>
    );
  }
}

export default GoodInfo;
