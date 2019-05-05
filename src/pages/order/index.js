import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtToast } from 'taro-ui';
import OrderHeader from './components/OrderHeader/index';
import GoodsCard from './components/GoodsCard/index';
import CouponCard from './components/CouponCard/index';
import Loading from '../../components/Loading/index';
import { isObj, verVal } from '../../utils/api';
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
      toastOpen: false,
      toastTxt: '',
      toastIcon: '',
    };
  }

  config = {
    navigationBarTitleText: '确认订单',
  };

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
      const { preload } = this.$router;
      if (
        isObj(preload) &&
        Array.isArray(preload.checkedGoods) &&
        preload.checkedGoods.length > 0
      ) {
        arr = list.filter(item => {
          return item.id === preload.checkedGoods.map(good => good.id);
        });
      } else {
        arr = [...list];
      }
      // 计算总价
      let totalMoney = 0;
      arr.map(item => {
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
  selectCallback = async totalMoney => {
    const preData = this.$router.preload;
    // 选择地址
    if (isObj(preData) && verVal(preData.addrId)) {
      const json = {
        addressId: preData.addrId,
        consignee: preData.consignee,
        phone: preData.phone,
        address: preData.address,
      };
      this.setState({
        addrInfo: { ...json },
      });
    }
    // 选择优惠券
    let couponInfo = Taro.getStorageSync('couponInfo');
    if (isObj(couponInfo) && verVal(couponInfo.couponId)) {
      let actualMoney = 0;
      const { integralDiscount } = this.state;
      // 优惠券金额小于等于总金额减去积分优惠金额
      if (couponInfo.couponAmount <= totalMoney - integralDiscount) {
        // 实付金额等于总金额减去优惠券金额与积分优惠金额
        actualMoney = totalMoney - (couponInfo.couponAmount + integralDiscount);
        this.setState({
          couponInfo,
          actualMoney: actualMoney.toFixed(2),
        });
        Taro.removeStorageSync('couponInfo');
      } else {
        this.toastFunc('优惠券金额不能大于实付金额', 'close-circle');
      }
    }
  };

  /**
   * 选择积分回调
   * @param score
   */
  onScoreCall = score => {
    const integralDiscount = score / 10; // 积分抵扣规则
    let actualMoney = 0;
    const { totalMoney, couponInfo } = this.state;
    // 如果已选择优惠券
    if (isObj(couponInfo) && verVal(couponInfo.couponAmount)) {
      // 积分金额小于等于总金额减去优惠券抵扣金额
      if (integralDiscount <= totalMoney - couponInfo.couponAmount) {
        // 实付金额等于总金额减去优惠券金额与积分优惠金额
        actualMoney = totalMoney - (integralDiscount + couponInfo.couponAmount);
      } else {
        this.toastFunc('积分抵用金额不能大于实付金额', 'close-circle');
      }
    } else {
      // 如果未选择优惠券, 实付金额等于总金额减去积分优惠金额
      actualMoney = this.state.totalMoney - integralDiscount;
    }
    this.setState({
      actualMoney,
      integralDiscount,
    });
  };

  /**
   * 支付成功删除商品
   */
  removeStorage = async () => {
    const { goodsList } = this.state;
    const goodsArr = JSON.parse(JSON.stringify(this.state.goodsList));

    let arr = [];
    arr = goodsList.filter(item => {
      let arr1 = goodsArr.map(good => good.id);
      return !arr1.includes(item.id);
    });
    await Taro.removeStorageSync('goodsList');
    await Taro.setStorageSync('goodsList', arr);
    this.$preload({
      current: 1,
    });
    setTimeout(function() {
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
      addrInfo.addressId === null ||
      typeof addrInfo.addressId === 'undefined' ||
      addrInfo.addressId === ''
    ) {
      this.toastFunc('请选择收货地址', 'close-circle');
      return;
    }
    let arr = [];
    this.state.goodsList.map(item => {
      arr.push({
        pdId: item.id,
        productAmount: (item.sellingPrice * item.num).toFixed(2),
        sellingNum: item.num,
      });
    });
    const that = this;
    Taro.requestPayment({
      timeStamp: '',
      nonceStr: '',
      package: '',
      signType: '',
      paySign: '',
      success: function() {
        that.toastFunc('支付成功', 'check-circle');
        that.removeStorage();
      },
      fail: function() {
        that.toastFunc('支付失败', 'close-circle');
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

  render() {
    const { addrInfo, couponInfo, goodsList } = this.state;
    return (
      <View className="orderWrap">
        <OrderHeader addrInfo={addrInfo} />

        <GoodsCard goodsList={goodsList} />

        <CouponCard
          totalMoney={this.state.totalMoney}
          couponInfo={couponInfo}
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
        <Loading isLoading={this.state.isLoading} />
      </View>
    );
  }
}
