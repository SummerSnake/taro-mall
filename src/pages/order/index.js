import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtToast } from 'taro-ui';
import OrderHeader from './components/OrderHeader/index';
import GoodsCard from './components/GoodsCard/index';
import GiftCard from './components/GiftCard/index';
import CouponCard from './components/CouponCard/index';
import Loading from '../../components/Loading/index';
import { postRequest } from '../../utils/api';
import './index.scss';

export default class Order extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      memId: '', // 会员 id
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
      paymentIntegral: 0, // 抵扣金额消耗积分
      isLoading: false,
      toastOpen: false,
      toastTxt: '',
      toastIcon: '',
    };
  }

  config = {
    navigationBarTitleText: '确认订单',
  };

  componentDidMount = async () => {
    this.setState({ isLoading: true });
    await this.fetchGoodsList();
    // 获取会员 id
    const menInfo = await postRequest('/member/getMemInfo');
    if (menInfo.code === 0) {
      await this.setState({ memId: menInfo.data.id });
      await this.fetchOrderInfo(menInfo.data.id);
    }
    // 选择地址
    if (this.$router.preload && typeof this.$router.preload.addressId !== 'undefined') {
      const preData = this.$router.preload;
      const json = {
        addressId: preData.addressId,
        consignee: preData.consignee,
        phone: preData.phone,
        address: preData.address,
      };
      this.setState({
        addrInfo: json,
      });
    }
    // 选择优惠券
    if (this.$router.preload && typeof this.$router.preload.couponId !== 'undefined') {
      const coupon = this.$router.preload;
      const couponInfo = {
        couponId: coupon.couponId,
        couponName: coupon.couponName,
        preferentialAmount: coupon.preferentialAmount,
      };
      let actualMoney = 0;
      // 优惠券金额小于总金额减去积分优惠金额
      if (coupon.preferentialAmount <= this.state.totalMoney - this.state.integralDiscount) {
        // 实付金额等于总金额减去优惠券金额与积分优惠金额
        actualMoney =
          this.state.totalMoney - (coupon.preferentialAmount + this.state.integralDiscount);
      } else {
        this.toastFunc('抵用金额不能大于实付金额', 'close-circle');
        return;
      }
      this.setState({
        couponInfo,
        actualMoney,
      });
    }
    this.setState({
      isLoading: false,
    });
  };

  /**
   * 获取商品列表
   */
  fetchGoodsList = async () => {
    // 从缓存中获取当前购买的商品信息
    if (Taro.getStorageSync('goodsList') && Taro.getStorageSync('goodsList').length > 0) {
      const goodsList = JSON.parse(JSON.stringify(Taro.getStorageSync('goodsList')));
      let goodsArr = []; // 当前购买商品数组
      if (Array.isArray(goodsList) && goodsList.length > 0) {
        let pdIds = [];
        goodsList.map(item => {
          if (pdIds.indexOf(item.id) === -1) {
            pdIds.push(item.id);
          }
        });
        pdIds = pdIds.join();
        // 通过商品 id 获取商品列表
        const data = await postRequest('/shoppingMall/getShoppingCartList', {
          pdIds,
        });
        const list = JSON.parse(JSON.stringify(data.data));
        // 从缓存中获取当前购买的商品数量
        list.map(item => {
          item.itemList.map(child => {
            goodsList.map(good => {
              if (child.id === good.id) {
                child.num = good.num;
              }
            });
          });
        });
        // 计算总价
        let totalMoney = this.state.totalMoney;
        list.map(item => {
          item.itemList.map(child => {
            totalMoney += parseFloat(child.num * child.sellingPrice);
            goodsArr.push(child);
          });
        });
        this.setState({
          totalMoney: totalMoney.toFixed(2),
          actualMoney: totalMoney.toFixed(2),
          goodsList: goodsArr,
        });
      }
    }
  };

  /**
   * 获取地址，发票，积分，优惠券信息
   * @param id
   */
  fetchOrderInfo = async id => {
    let goodsList = [];
    this.state.goodsList.map(item => {
      let json2 = {
        id: item.id,
        productAmount: (item.sellingPrice * item.num).toFixed(2),
      };
      goodsList.push(json2);
    });
    const orderInfo = await postRequest('/shoppingMall/getIntegralAndCoupon', {
      mallOrderPdList: goodsList,
      memberId: id,
    });
    if (orderInfo.code === 0) {
      const addrData = orderInfo.data.memberSite;
      if (Object.keys(addrData).length > 0) {
        const json = {
          addressId: addrData.id,
          consignee: addrData.consigneeName,
          phone: addrData.consigneePhone,
          address: `${addrData.province}${addrData.city}${addrData.area}${
            addrData.detailedAddress
          }`,
        };
        this.setState({
          addrInfo: json,
        });
      }
      this.setState({
        orderInfo: orderInfo.data,
      });
    }
  };

  /**
   * 选择积分回调
   * @param score
   */
  onScoreCall = score => {
    const { deductionAmount, integralDosage } = this.state.orderInfo.integraRule;
    const integralDiscount = score * (deductionAmount / integralDosage);
    let actualMoney = 0;
    // 积分金额小于总金额减去优惠券抵扣金额
    if (integralDiscount <= this.state.totalMoney - this.state.couponInfo.preferentialAmount) {
      // 实付金额等于总金额减去优惠券金额与积分优惠金额
      if (Object.keys(this.state.couponInfo).length > 0) {
        actualMoney =
          this.state.totalMoney - (integralDiscount + this.state.couponInfo.preferentialAmount);
      } else {
        actualMoney = this.state.totalMoney - integralDiscount;
      }
    } else {
      this.toastFunc('抵用金额不能大于实付金额', 'close-circle');
      return;
    }
    this.setState({
      actualMoney,
      integralDiscount,
      paymentIntegral: score,
    });
  };

  /**
   * 支付成功删除商品
   */
  removeStorage = async () => {
    const goodsList = JSON.parse(JSON.stringify(Taro.getStorageSync('goodsList')));
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
    const data = await postRequest('/shoppingMall/membershipOrder', {
      actualMoney: this.state.actualMoney,
      couponId: this.state.couponInfo.couponId,
      exchangePoints: this.state.orderInfo.consumeIntegral,
      integralDiscount: this.state.integralDiscount,
      memberSiteId: this.state.addrInfo.addressId,
      mallOrderPdList: arr,
      memberId: this.state.memId,
      orderMoney: this.state.totalMoney,
      paymentIntegral: this.state.paymentIntegral,
    });
    if (data.code === 0) {
      Taro.requestPayment({
        timeStamp: data.data.timeStamp,
        nonceStr: data.data.nonceStr,
        package: data.data.packageValue,
        signType: data.data.signType,
        paySign: data.data.paySign,
        success: function() {
          that.toastFunc('支付成功', 'check-circle');
          that.removeStorage();
        },
        fail: function() {
          that.toastFunc('支付失败', 'close-circle');
        },
      });
    }
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
