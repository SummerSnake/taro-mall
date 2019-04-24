import Taro, { Component } from '@tarojs/taro';
import { View, Input } from '@tarojs/components';
import { AtToast } from 'taro-ui';
import { connect } from '@tarojs/redux';
import Loading from '@/components/Loading/index';
import { verVal } from "@/utils/api";
import './index.scss';

@connect(({ phoneEdit, loading }) => ({
  ...phoneEdit,
  ...loading,
}))
export default class PhoneEdit extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      count: 60,
      btnChange: true,
    };
  }

  config = {
    navigationBarTitleText: '认证手机',
  };

  /**
   * 认证手机输入框
   * @param e
   */
  handleOldPhoneChange = async (e) => {
    this.props.dispatch({
      type: 'phoneEdit/save',
      payload: {
        oldPhone: e.detail.value,
      }
    });
  };

  /**
   * 新手机输入框
   * @param e
   */
  handleNewPhoneChange = async (e) => {
    this.props.dispatch({
      type: 'phoneEdit/save',
      payload: {
        newPhone: e.detail.value,
      }
    });
  };

  /**
   * 新手机验证码输入框
   * @param e
   */
  handleNewSmsCodeChange = async (e) => {
    this.props.dispatch({
      type: 'phoneEdit/save',
      payload: {
        newSmsCode: e.detail.value,
      }
    });
  };

  /**
   * 获取新手机验证码
   */
  getSmsCode = async () => {
    if (!verVal(this.props.newPhone)) {
      this.toastFunc('请填写新手机号', 'close-circle');
      return;
    }
    if (this.state.btnChange) {
      this.setState({ btnChange: false });
      this.props.dispatch({
        type: 'phoneEdit/sendSmsCode',
      });
      this.timer = setInterval(() => {
        let counter = this.state.count;
        counter -= 1;
        if (counter < 1) {
          this.setState({
            btnChange: true,
          });
          counter = 60;
          clearInterval(this.timer);
        }
        this.setState({
          count: counter,
        });
      }, 1000);
    }
  };

  /**
   * 提交
   */
  handleSubmit = async () => {
    // 输入框非空验证
    if (this.checkInputVal(this.props.oldPhone, '请输入认证手机')) {
      return;
    }
    if (this.checkInputVal(this.props.newPhone, '请输入新手机号')) {
      return;
    }
    if (this.checkInputVal(this.props.newSmsCode, '请输入新手机号验证码')) {
      return;
    }
    this.props.dispatch({
      type: 'phoneEdit/submit',
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
   * toast 弹出
   */
  toastFunc = (txt, icon) => {
    this.props.dispatch({
      type: 'phoneEdit/save',
      payload: {
        toastOpen: true,
        toastTxt: txt,
        toastIcon: icon,
      }
    });
    setTimeout(() => {
      this.props.dispatch({
        type: 'phoneEdit/save',
        payload: {
          toastOpen: false,
        }
      });
    }, 2000);
  };

  render() {
    const { oldPhone, newPhone, newSmsCode, toastOpen, toastTxt, toastIcon, effects } = this.props;
    return (
      <View className='phoneEditWrap'>
        <View>
          <View className='infoItem'>
            <View className='prefixDom left'>认证手机：</View>
            <View className='inputDom left'>
              <Input
                type='text'
                value={oldPhone}
                onChange={this.handleOldPhoneChange.bind(this)}
                className='inputNode'
              />
            </View>
          </View>
          <View className='infoItem'>
            <View className='prefixDom left'>新手机：</View>
            <View className='inputDom left'>
              <Input
                type='text'
                value={newPhone}
                onChange={this.handleNewPhoneChange.bind(this)}
                className='inputNode'
              />
            </View>
          </View>
          <View className='infoItem'>
            <View className='prefixDom left'>验证码：</View>
            <View className='inputDom left'>
              <Input
                type='text'
                value={newSmsCode}
                onChange={this.handleNewSmsCodeChange.bind(this)}
                className='inputNode'
              />
            </View>
            <View
              onClick={this.getSmsCode.bind(this)}
              className='verBtn right'
              style={{ backgroundColor: this.state.btnChange ? '#e80e27' : '#ccc' }}
            >
              {this.state.btnChange ? '获取验证码' : `重新发送(${this.state.count})`}
            </View>
          </View>
        </View>


        <View className='submitBtn' onClick={this.handleSubmit.bind(this)}>
          提交
        </View>

        <Loading isLoading={effects['phoneEdit/submit'] || effects['phoneEdit/sendSmsCode']} />

        <AtToast isOpened={toastOpen} text={toastTxt} icon={toastIcon} />
      </View>
    );
  }
}
