import Taro, { Component } from '@tarojs/taro';
import { View, Input } from '@tarojs/components';
import { AtToast } from 'taro-ui';
import { connect } from '@tarojs/redux';
import Loading from '@/components/Loading/index';
import { verVal } from "@/utils/api";
import './index.scss';

@connect(({ invoiceEdit, loading }) => ({
  ...invoiceEdit,
  ...loading,
}))
export default class InvoiceEdit extends Component {

  config = {
    navigationBarTitleText: '增值发票',
  };

  componentDidMount = async () => {
    this.props.dispatch({
      type: 'invoiceEdit/load',
    });
  };

  /**
   * 单位名称输入框
   * @param e
   */
  handleCompanyChange = async (e) => {
    this.props.dispatch({
      type: 'invoiceEdit/save',
      payload: {
        params: {
          ...this.props.params,
          company: e.detail.value,
        }
      }
    });
  };

  /**
   * 纳税人识别码输入框
   * @param e
   */
  handleTaxpayerChange = async (e) => {
    this.props.dispatch({
      type: 'invoiceEdit/save',
      payload: {
        params: {
          ...this.props.params,
          taxpayer: e.detail.value,
        }
      }
    });
  };

  /**
   * 注册地址输入框
   * @param e
   */
  handleRegaddrChange = async (e) => {
    this.props.dispatch({
      type: 'invoiceEdit/save',
      payload: {
        params: {
          ...this.props.params,
          regAddr: e.detail.value,
        }
      }
    });
  };

  /**
   * 注册电话输入框
   * @param e
   */
  handleRegPhoneChange = async (e) => {
    this.props.dispatch({
      type: 'invoiceEdit/save',
      payload: {
        params: {
          ...this.props.params,
          regPhone: e.detail.value,
        }
      }
    });
  };

  /**
   * 开户银行输入框
   * @param e
   */
  handleBankChange = async (e) => {
    this.props.dispatch({
      type: 'invoiceEdit/save',
      payload: {
        params: {
          ...this.props.params,
          bank: e.detail.value,
        }
      }
    });
  };

  /**
   * 认证手机输入框
   * @param e
   */
  handleBankAccountChange = async (e) => {
    this.props.dispatch({
      type: 'invoiceEdit/save',
      payload: {
        params: {
          ...this.props.params,
          bankAccount: e.detail.value,
        }
      }
    });
  };

  /**
   * 提交
   */
  handleSubmit = async () => {
    const { params } = this.props;
    if (this.checkInputVal(params.company, '请输入单位名称')) {
      return;
    }
    if (this.checkInputVal(params.taxpayer, '请输入纳税人识别码')) {
      return;
    }
    if (this.checkInputVal(params.regAddr, '请输入注册地址')) {
      return;
    }
    if (this.checkInputVal(params.regPhone, '请输入注册电话')) {
      return;
    }
    if (this.checkInputVal(params.bank, '请输入开户银行')) {
      return;
    }
    if (this.checkInputVal(params.bankAccount, '请输入银行账户')) {
      return;
    }
    this.props.dispatch({
      type: 'invoiceEdit/submit',
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
   * toast 弹出
   */
  toastFunc = (txt, icon) => {
    this.props.dispatch({
      type: 'invoiceEdit/save',
      payload: {
        toastOpen: true,
        toastTxt: txt,
        toastIcon: icon,
      }
    });
    setTimeout(() => {
      this.props.dispatch({
        type: 'invoiceEdit/save',
        payload: {
          toastOpen: false,
        }
      });
    }, 2000);
  };

  render() {
    const { params, toastOpen, toastTxt, toastIcon  } = this.props;
    return (
      <View className='invoiceEditWrap'>
        <View>
          <View className='infoItem clearfix'>
            <View className='prefixDom left'>单位名称：</View>
            <View className='inputDom left'>
              <Input
                type='text'
                value={params.company}
                onChange={this.handleCompanyChange.bind(this)}
                className='inputNode'
              />
            </View>
          </View>
          <View className='infoItem clearfix'>
            <View className='prefixDom left'>纳税人识别码：</View>
            <View className='inputDom left'>
              <Input
                type='text'
                value={params.taxpayer}
                onChange={this.handleTaxpayerChange.bind(this)}
                className='inputNode'
              />
            </View>
          </View>
          <View className='infoItem clearfix'>
            <View className='prefixDom left'>注册地址：</View>
            <View className='inputDom left'>
              <Input
                type='text'
                value={params.regAddr}
                onChange={this.handleRegaddrChange.bind(this)}
                className='inputNode'
              />
            </View>
          </View>
          <View className='infoItem clearfix'>
            <View className='prefixDom left'>注册电话：</View>
            <View className='inputDom left'>
              <Input
                type='text'
                value={params.regPhone}
                onChange={this.handleRegPhoneChange.bind(this)}
                className='inputNode'
              />
            </View>
          </View>
          <View className='infoItem clearfix'>
            <View className='prefixDom left'>开户银行：</View>
            <View className='inputDom left'>
              <Input
                type='text'
                value={params.bank}
                onChange={this.handleBankChange.bind(this)}
                className='inputNode'
              />
            </View>
          </View>
          <View className='infoItem clearfix'>
            <View className='prefixDom left'>银行账户：</View>
            <View className='inputDom left'>
              <Input
                type='text'
                value={params.bankAccount}
                onChange={this.handleBankAccountChange.bind(this)}
                className='inputNode'
              />
            </View>
          </View>
        </View>

        <View className='submitBtn' onClick={this.handleSubmit.bind(this)}>提交</View>

        <AtToast isOpened={toastOpen} text={toastTxt} icon={toastIcon} />

        <Loading isLoading={this.state.isLoading} />
      </View>
    );
  }
}
