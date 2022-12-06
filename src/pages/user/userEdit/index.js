import Taro, { Component } from '@tarojs/taro';
import { View, Input, Picker } from '@tarojs/components';
import { AtToast } from 'taro-ui';
import { connect } from '@tarojs/redux';
import Loading from '@/components/Loading/index';
import { verVal } from '@/utils/api';
import './index.scss';

@connect(({ userEdit, loading }) => ({
  ...userEdit,
  ...loading,
}))
class UserEdit extends Component {
  config = {
    navigationBarTitleText: '个人设置',
  };

  componentDidMount = async () => {
    this.props.dispatch({
      type: 'userEdit/load',
    });
  };

  /**
   * 会员称呼输入框
   * @param e
   */
  onAppellationChange = async e => {
    this.props.dispatch({
      type: 'userEdit/save',
      payload: {
        appellation: e.detail.value,
      },
    });
  };

  /**
   * 出生日期输入框
   * @param e
   */
  onBirthChange = async e => {
    this.props.dispatch({
      type: 'userEdit/save',
      payload: {
        birth: e.detail.value,
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
  submitEdit = async () => {
    if (this.checkInputVal(this.props.appellation, '请输入称呼')) {
      return;
    }
    if (this.checkInputVal(this.props.birth, '请输入出生日期')) {
      return;
    }
    this.props.dispatch({
      type: 'userEdit/submit',
    });
  };

  /**
   * toast 弹出
   */
  toastFunc = (txt, icon) => {
    this.props.dispatch({
      type: 'userEdit/save',
      payload: {
        toastOpen: true,
        toastTxt: txt,
        toastIcon: icon,
      },
    });
    setTimeout(() => {
      this.props.dispatch({
        type: 'userEdit/save',
        payload: {
          toastOpen: false,
        },
      });
    }, 2000);
  };

  render() {
    const { appellation, birth, toastOpen, toastTxt, toastIcon, effects } = this.props;
    return (
      <View className="phoneEditWrap">
        <View className="infoItem clearfix">
          <View className="prefixDom left">称呼：</View>
          <View className="inputDom left">
            <Input
              type="text"
              value={appellation}
              onChange={this.onAppellationChange.bind(this)}
              className="inputNode"
            />
          </View>
        </View>

        <View>
          <View className="infoItem clearfix">
            <View className="prefixDom left">出生日期：</View>
            <View className="inputDom left">
              <Picker
                mode="date"
                onChange={this.onBirthChange.bind(this)}
                value={birth}
                className="inputNode"
              >
                <View className="pickerNode ellipsis">{birth}</View>
              </Picker>
            </View>
          </View>
        </View>

        <View className="submitBtn" onClick={this.submitEdit.bind(this)}>
          提交
        </View>

        <AtToast isOpened={toastOpen} text={toastTxt} icon={toastIcon} />

        <Loading isLoading={effects['userEdit/load']} />
      </View>
    );
  }
}

export default UserEdit;
