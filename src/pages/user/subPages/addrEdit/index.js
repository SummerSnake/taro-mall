import Taro, { Component } from '@tarojs/taro';
import { View, Text, Picker, Input } from '@tarojs/components';
import { AtToast, AtIcon } from 'taro-ui';
import { connect } from '@tarojs/redux';
import Loading from '@/components/Loading/index';
import { verVal } from '@/utils/api';
import './index.scss';

@connect(({ addrEdit, loading }) => ({
  ...addrEdit,
  ...loading,
}))
export default class AddrEdit extends Component {
  config = {
    navigationBarTitleText: '收货地址设置',
  };

  componentDidMount = () => {
    if (this.$router.preload && this.$router.preload.itemClone) {
      const itemClone = { ...this.$router.preload.itemClone };
      this.props.dispatch({
        type: 'addrEdit/save',
        payload: {
          params: {
            ...this.props.params,
            consignee: itemClone.consignee,
            phone: itemClone.phone,
            area: [itemClone.province, itemClone.city, itemClone.region],
            detailAddr: itemClone.detailAddr,
            checkedVal: itemClone.type === 1,
          },
        },
      });
    }
  };

  /**
   * 收货人输入框
   * @param e
   */
  handleConsigneeChange = async e => {
    this.props.dispatch({
      type: 'addrEdit/save',
      payload: {
        params: {
          ...this.props.params,
          consignee: e.detail.value,
        },
      },
    });
  };

  /**
   * 认证手机输入框
   * @param e
   */
  handlePhoneChange = async e => {
    this.props.dispatch({
      type: 'addrEdit/save',
      payload: {
        params: {
          ...this.props.params,
          phone: e.detail.value,
        },
      },
    });
  };

  /**
   * 省市区选择框
   * @param e
   */
  handleAreaChange = e => {
    this.props.dispatch({
      type: 'addrEdit/save',
      payload: {
        params: {
          ...this.props.params,
          area: e.detail.value,
        },
      },
    });
  };

  /**
   * 详细地址输入框
   * @param e
   */
  handleDetailAddrChange = e => {
    this.props.dispatch({
      type: 'addrEdit/save',
      payload: {
        params: {
          ...this.props.params,
          detailAddr: e.detail.value,
        },
      },
    });
  };

  /**
   * 设为默认地址
   */
  handleCheckedChange = () => {
    this.props.dispatch({
      type: 'addrEdit/save',
      payload: {
        params: {
          ...this.props.params,
          checkedVal: !this.props.params.checkedVal,
        },
      },
    });
  };

  /**
   * 检测输入框值是否为空
   */
  checkInputVal = (inputVal, toastTxt) => {
    if (!verVal(inputVal)) {
      this.toastFunc(toastTxt, 'close-circle');
      return true;
    }
  };

  /**
   * 提交
   */
  handleSubmit = async () => {
    const { params } = this.props;
    if (this.checkInputVal(params.consignee, '请输入收货人')) {
      return;
    }
    if (this.checkInputVal(params.phone, '请输入手机号码')) {
      return;
    }
    if (params.area.length === 0) {
      this.toastFunc('请选择所在地区', 'close-circle');
      return;
    }
    if (this.checkInputVal(params.detailAddr, '请输入详细地址')) {
      return;
    }
    this.props.dispatch({
      type: 'addrEdit/submit',
    });
  };

  /**
   * toast 弹出
   */
  toastFunc = (txt, icon) => {
    this.props.dispatch({
      type: 'addrEdit/save',
      payload: {
        toastOpen: true,
        toastTxt: txt,
        toastIcon: icon,
      },
    });
    setTimeout(() => {
      this.props.dispatch({
        type: 'addrEdit/save',
        payload: {
          toastOpen: false,
        },
      });
    }, 2000);
  };

  render() {
    const { params, toastOpen, toastTxt, toastIcon, effects } = this.props;
    return (
      <View className="userEditWrap">
        <View className="infoItem clearfix">
          <View className="prefixDom left">收货人：</View>
          <View className="inputDom left">
            <Input
              placeholder="请输入收货人"
              value={params.consignee}
              onChange={this.handleConsigneeChange.bind(this)}
              className="inputNode"
            />
          </View>
        </View>
        <View className="infoItem clearfix">
          <View className="prefixDom left">手机号码：</View>
          <View className="inputDom left">
            <Input
              placeholder="请输入手机号码"
              value={params.phone}
              onChange={this.handlePhoneChange.bind(this)}
              className="inputNode"
            />
          </View>
        </View>
        <View className="infoItem clearfix">
          <View className="prefixDom left">所在地区：</View>
          <View className="inputDom left">
            <Picker
              mode="region"
              onChange={this.handleAreaChange}
              value={params.area}
              className="inputNode"
            >
              <View className="pickerNode ellipsis">
                <Text>{params.area[0]}</Text>
                <Text>{params.area[1]}</Text>
                <Text>{params.area[2]}</Text>
              </View>
            </Picker>
          </View>
        </View>
        <View className="infoItem clearfix">
          <View className="prefixDom left">详细地址：</View>
          <View className="inputDom left">
            <Input
              placeholder="请输入详细地址"
              value={params.detailAddr}
              onChange={this.handleDetailAddrChange.bind(this)}
              className="inputNode"
            />
          </View>
        </View>
        <View className="infoItem clearfix">
          <View className="prefixDom left">设为默认地址：</View>
          <View className="inputDom left">
            <View
              className={params.checkedVal ? 'cardCheckActive' : 'cardCheck'}
              onClick={this.handleCheckedChange.bind(this)}
            >
              <View style={{ display: params.checkedVal ? 'block' : 'none' }}>
                <AtIcon prefixClass="fa" value="checked" size="16" color="#fff" />
              </View>
            </View>
          </View>
        </View>

        <View className="submitBtn" onClick={this.handleSubmit.bind(this)}>
          提交
        </View>

        <Loading isLoading={effects['addrEdit/submit']} />

        <AtToast isOpened={toastOpen} text={toastTxt} icon={toastIcon} />
      </View>
    );
  }
}
