import Taro, { Component } from '@tarojs/taro';
import { View, Text, Picker, Input } from '@tarojs/components';
import { AtToast, AtIcon } from 'taro-ui';
import { connect } from '@tarojs/redux';
import Loading from '@/components/Loading/index';
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
          consignee: itemClone.consignee,
          phone: itemClone.phone,
          region: [itemClone.province, itemClone.city, itemClone.region],
          detail: itemClone.detailAddr,
          checkedVal: itemClone.type === 1,
        }
      });
    }
  };

  /**
   * 收货人输入框
   * @param e
   */
  onConsigneeChange = async (e) => {
    this.props.dispatch({
      type: 'addrEdit/save',
      payload: {
        consignee: e.detail.value,
      }
    });
  };

  /**
   * 认证手机输入框
   * @param e
   */
  onPhoneChange = async (e) => {
    this.props.dispatch({
      type: 'addrEdit/save',
      payload: {
        phone: e.detail.value,
      }
    });
  };

  /**
   * 省市区选择框
   * @param e
   */
  regionChange = (e) => {
    this.props.dispatch({
      type: 'addrEdit/save',
      payload: {
        region: e.detail.value,
      }
    });
  };

  /**
   * 详细地址输入框
   * @param e
   */
  onDetailChange = (e) => {
    this.props.dispatch({
      type: 'addrEdit/save',
      payload: {
        detail: e.detail.value,
      }
    });
  };

  /**
   * 设为默认地址
   */
  checkedChange = () => {
    this.props.dispatch({
      type: 'addrEdit/save',
      payload: {
        checkedVal: !this.props.checkedVal,
      }
    });
  };

  /**
   * 检测输入框值是否为空
   */
  checkInputVal = (inputVal, toastTxt) => {
    if (inputVal === '') {
      this.toastFunc(toastTxt, 'close-circle');
      return true;
    }
  };

  /**
   * 提交
   */
  submitEdit = async () => {
    const { consignee, phone, region, detail } = this.props;
    if (this.checkInputVal(consignee, '请输入收货人')) {
      return;
    }
    if (this.checkInputVal(phone, '请输入手机号码')) {
      return;
    }
    if (region.length === 0) {
      this.toastFunc('请选择所在地区', 'close-circle');
      return;
    }
    if (this.checkInputVal(detail, '请输入详细地址')) {
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
      }
    });
    setTimeout(() => {
      this.props.dispatch({
        type: 'addrEdit/save',
        payload: {
          toastOpen: false,
        }
      });
    }, 2000);
  };

  render() {
    const { consignee, phone, region, detail, checkedVal, toastOpen, toastTxt, toastIcon, effects } = this.props;
    return (
      <View className='userEditWrap'>
        <View className='infoItem'>
          <View className='prefixDom left'>收货人：</View>
          <View className='inputDom left'>
            <Input
              placeholder='请输入收货人'
              value={consignee}
              onChange={this.onConsigneeChange.bind(this)}
              className='inputNode'
            />
          </View>
        </View>
        <View className='infoItem'>
          <View className='prefixDom left'>手机号码：</View>
          <View className='inputDom left'>
            <Input
              placeholder='请输入手机号码'
              value={phone}
              onChange={this.onPhoneChange.bind(this)}
              className='inputNode'
            />
          </View>
        </View>
        <View className='infoItem'>
          <View className='prefixDom left'>所在地区：</View>
          <View className='inputDom left'>
            <Picker
              mode='region'
              onChange={this.regionChange}
              value={region}
              className='inputNode'
            >
              <View className='pickerNode ellipsis'>
                <Text>{region[0]}</Text>
                <Text>{region[1]}</Text>
                <Text>{region[2]}</Text>
              </View>
            </Picker>
          </View>
        </View>
        <View className='infoItem'>
          <View className='prefixDom left'>详细地址：</View>
          <View className='inputDom left'>
            <Input
              placeholder='请输入详细地址'
              value={detail}
              onChange={this.onDetailChange.bind(this)}
              className='inputNode'
            />
          </View>
        </View>
        <View className='infoItem'>
          <View className='prefixDom left'>设为默认地址：</View>
          <View className='inputDom left'>
            <View
              className={checkedVal ? 'cardCheckActive' : 'cardCheck'}
              onClick={this.checkedChange.bind(this)}
            >
              <View style={{ display: checkedVal ? 'block' : 'none' }}>
                <AtIcon
                  prefixClass='fa'
                  value='checked'
                  size='16'
                  color='#fff'
                />
              </View>
            </View>
          </View>
        </View>

        <View className='submitBtn' onClick={this.submitEdit.bind(this)}>提交</View>

        <Loading isLoading={effects['addrEdit/submit']} />

        <AtToast isOpened={toastOpen} text={toastTxt} icon={toastIcon} />
      </View>
    );
  }
}
