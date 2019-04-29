import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtToast } from 'taro-ui';
import OrderHeader from './components/OrderHeader/index';
import GoodsCard from './components/GoodsCard/index';
import GiftCard from './components/GiftCard/index';
import CouponCard from './components/CouponCard/index';
import Loading from '../../components/Loading/index';
import { isObj, verVal } from '../../utils/api';
import './index.scss';

export default class Order extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      goodsList: [], // 已购商品列表
      orderInfo: {
        // 地址，发票，积分，优惠券信息
        couponIds: [],
        integraRule: {},
        memberInvoice: {},
        memberSite: {},
      },
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
    await this.fetchGoodsList();
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
    if (isObj(preData) && verVal(preData.couponId)) {
      const couponInfo = {
        couponId: preData.couponId,
        couponName: preData.couponName,
        couponAmount: preData.couponAmount,
      };
      let actualMoney = 0;
      const { totalMoney, integralDiscount } = this.state;
      // 优惠券金额小于等于总金额减去积分优惠金额
      if (preData.couponAmount <= totalMoney - integralDiscount) {
        // 实付金额等于总金额减去优惠券金额与积分优惠金额
        actualMoney = totalMoney - (preData.couponAmount + integralDiscount);
      } else {
        this.toastFunc('抵用金额不能大于实付金额', 'close-circle');
        return;
      }
      this.setState({
        couponInfo,
        actualMoney: actualMoney.toFixed(2),
      });
    }
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
      const preData = this.$router.preload;
      const { checkedGoods } = preData;
      if (isObj(preData) && Array.isArray(checkedGoods) && checkedGoods.length > 0) {
        arr = list.filter(item => {
          return item.id === checkedGoods.map(good => good.id);
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
        goodsList: list,
      });
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
        this.toastFunc('抵用金额不能大于实付金额', 'close-circle');
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
      memId: this.state.id,
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
    const { addrInfo, goodsList, orderInfo } = this.state;
    return (
      <View className="orderWrap">
        <OrderHeader
          memId={this.state.memId}
          addrInfo={addrInfo}
          company={orderInfo.memberInvoice.name}
        />

        <GoodsCard goodsList={goodsList} />

        <GiftCard orderInfo={orderInfo} />

        <CouponCard
          memId={this.state.memId}
          couponIds={orderInfo.couponIds}
          totalMoney={this.state.totalMoney}
          couponInfo={this.state.couponInfo}
          integraRule={orderInfo.integraRule}
          orderInfo={orderInfo}
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
