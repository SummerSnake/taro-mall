import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtToast } from 'taro-ui';

import { isObj, isNotNull } from '@/utils/util';
import OrderHeader from './components/OrderHeader/index';
import GoodsCard from './components/GoodsCard/index';
import CouponCard from './components/CouponCard/index';
import './index.scss';

export default class Order extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      goodsList: [], // 已购商品列表
      addrInfo: {}, // 地址信息
      couponInfo: {}, // 当前所选优惠券信息
      totalMoney: 0, // 总金额
      actualMoney: 0, // 实际需要支付金额
      integralDiscount: 0, // 积分优惠金额
      pickerChange: false, // 积分选择开关
      toastOpen: false,
      toastTxt: '',
      toastIcon: '',
    };
  }

  componentDidShow = async () => {
    this.fetchGoodsList();
  };

  /**
   * 获取商品列表
   */
  fetchGoodsList = async () => {
    // 从缓存中获取当前购买的商品信息
    let list = Taro.getStorageSync('goodsList');
    if (Array.isArray(list) && list.length > 0) {
      let arr = [];
      // 购物车选择的商品
      const {
        router: { params },
      } = getCurrentInstance() && getCurrentInstance();

      if (params?.checkedGoods) {
        const { checkedGoods } = params;
        if (Array.isArray(checkedGoods) && checkedGoods.length > 0) {
          arr = list.filter((item) => {
            return checkedGoods.includes(item.id);
          });
        }
      } else {
        arr = [...list];
      }
      // 计算总价
      let totalMoney = 0;
      arr.map((item) => {
        totalMoney += parseFloat(item.num) * parseFloat(item.price);
      });
      this.setState({
        totalMoney: totalMoney.toFixed(2),
        actualMoney: totalMoney.toFixed(2),
        goodsList: arr,
      });
      this.selectCallback(totalMoney);
    }
  };

  /**
   * 选择地址、选择优惠券
   * @param totalMoney
   */
  selectCallback = async (totalMoney) => {
    let addrInfo = Taro.getStorageSync('addrInfo');
    // 选择地址
    if (isObj(addrInfo) && isNotNull(addrInfo.addrId)) {
      this.setState({
        addrInfo: { ...addrInfo },
      });
    }
    // 选择优惠券
    let couponInfo = Taro.getStorageSync('couponInfo');
    if (isObj(couponInfo) && isNotNull(couponInfo.couponId)) {
      let actualMoney = 0;
      const { integralDiscount } = this.state;
      // 优惠券金额小于等于总金额减去积分优惠金额
      if (couponInfo.couponAmount <= totalMoney - integralDiscount) {
        // 实付金额等于总金额减去优惠券金额与积分优惠金额
        actualMoney = totalMoney - (couponInfo.couponAmount + integralDiscount);
        this.setState({
          couponInfo: { ...couponInfo },
          actualMoney: actualMoney.toFixed(2),
        });
      } else {
        this.toastFunc('优惠券金额不能大于实付金额', 'close-circle');
      }
    }
  };

  /**
   * 选择积分回调
   * @param score
   */
  onScoreCall = (score) => {
    const integralDiscount = score / 10; // 积分抵扣规则
    let actualMoney = 0;
    const { totalMoney, couponInfo } = this.state;
    // 如果已选择优惠券
    if (isObj(couponInfo) && isNotNull(couponInfo.couponAmount)) {
      // 积分金额小于等于总金额减去优惠券抵扣金额
      if (integralDiscount <= totalMoney - couponInfo.couponAmount) {
        // 实付金额等于总金额减去优惠券金额与积分优惠金额
        actualMoney = totalMoney - (integralDiscount + couponInfo.couponAmount);
        this.setState({
          integralDiscount,
          actualMoney: actualMoney.toFixed(2),
          pickerChange: true,
        });
      } else {
        this.toastFunc('积分抵用金额不能大于实付金额', 'close-circle');
      }
    } else {
      // 如果未选择优惠券
      if (integralDiscount <= totalMoney) {
        // 实付金额等于总金额减去积分优惠金额
        actualMoney = totalMoney - integralDiscount;
        this.setState({
          integralDiscount,
          actualMoney: actualMoney.toFixed(2),
          pickerChange: true,
        });
      } else {
        this.toastFunc('积分抵用金额不能大于实付金额', 'close-circle');
      }
    }
    setTimeout(() => {
      this.setState({
        pickerChange: false,
      });
    }, 500);
  };

  /**
   * 支付成功删除商品
   */
  removeStorage = async () => {
    const { goodsList } = this.state;
    const goodsArr = JSON.parse(JSON.stringify(this.state.goodsList));

    let arr = [];
    arr = goodsList.filter((item) => {
      let arr1 = goodsArr.map((good) => good.id);
      return !arr1.includes(item.id);
    });
    await Taro.removeStorageSync('goodsList');
    await Taro.setStorageSync('goodsList', arr);
    this.$preload({
      current: 1,
    });
    setTimeout(function () {
      Taro.redirectTo({
        url: '/pages/orderList/index',
      });
    }, 2000);
  };

  /**
   * 支付
   */
  goPay = async () => {
    const addrInfo = this.state.addrInfo;
    if (
      Object.keys(addrInfo).length === 0 ||
      typeof addrInfo.addrId === 'undefined' ||
      addrInfo.addrId === null ||
      addrInfo.addrId === ''
    ) {
      this.toastFunc('请选择收货地址', 'close-circle');
      return;
    }
    if (this.state.actualMoney <= 0) {
      this.toastFunc('请选择您要购买的商品', 'close-circle');
      return;
    }
    const that = this;
    Taro.requestPayment({
      timeStamp: '',
      nonceStr: '',
      package: '',
      signType: '',
      paySign: '',
      success: function () {
        that.toastFunc('支付成功', 'check-circle');
        that.removeStorage();
        Taro.removeStorageSync('couponInfo');
      },
      fail: function () {
        that.toastFunc('支付失败', 'close-circle');
        Taro.removeStorageSync('couponInfo');
      },
    });
  };

  /**
   * toast 弹出
   */
  toastFunc = (toastTxt, toastIcon) => {
    this.setState({
      toastTxt,
      toastIcon,
    });
    this.setState({ toastOpen: true });
    setTimeout(() => {
      this.setState({ toastOpen: false });
    }, 2000);
  };

  /**
   * 卸载页面删除优惠券缓存
   */
  componentWillUnmount = () => {
    Taro.removeStorageSync('couponInfo');
  };

  render() {
    const { addrInfo, couponInfo, goodsList } = this.state;
    return (
      <View className="orderWrap">
        <OrderHeader addrInfo={addrInfo} />

        <GoodsCard goodsList={goodsList} />

        <CouponCard
          totalMoney={this.state.totalMoney}
          couponInfo={couponInfo}
          pickerChange={this.state.pickerChange}
          onScoreCall={this.onScoreCall}
        />

        <View className="orderBottom">
          <View>
            合计：<Text>￥{this.state.actualMoney}</Text>
          </View>
          <View className="goPay" onClick={this.goPay.bind(this)}>
            支付
          </View>
        </View>

        <AtToast
          isOpened={this.state.toastOpen}
          text={this.state.toastTxt}
          icon={this.state.toastIcon}
        />
      </View>
    );
  }
}
