import Taro, { Component } from '@tarojs/taro';
import { View, Textarea, Text } from '@tarojs/components';
import { AtToast } from 'taro-ui';
import { connect } from '@tarojs/redux';
import Upload from '@/components/Upload/index';
import Loading from '@/components/Loading/index';
import { verVal } from '@/utils/api';
import './index.scss';

@connect(({ suggestion, loading }) => ({
  ...suggestion,
  ...loading,
}))
export default class Suggestion extends Component {
  config = {
    navigationBarTitleText: '反馈建议',
  };

  /**
   * 反馈建议输入框
   * @param e
   */
  handleSuggestionChange = e => {
    this.props.dispatch({
      type: 'suggestion/save',
      payload: {
        suggestionVal: e.target.value,
      },
    });
  };

  /**
   * 上传图片回调
   * @param imgList
   */
  onUploadCall = imgList => {
    this.props.dispatch({
      type: 'suggestion/save',
      payload: {
        imgList: [...imgList],
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
    if (this.checkInputVal(this.props.suggestionVal, '请输入反馈建议')) {
      return;
    }
    this.props.dispatch({
      type: 'suggestion/submit',
    });
  };

  /**
   * toast 弹出
   */
  toastFunc = (txt, icon) => {
    this.props.dispatch({
      type: 'suggestion/save',
      payload: {
        toastOpen: true,
        toastTxt: txt,
        toastIcon: icon,
      },
    });
    setTimeout(() => {
      this.props.dispatch({
        type: 'suggestion/save',
        payload: {
          toastOpen: false,
        },
      });
    }, 2000);
  };

  componentWillUnmount = () => {
    this.props.dispatch({
      type: 'suggestion/save',
      payload: {
        suggestionVal: '',
        imgList: [],
      },
    });
  };

  render() {
    const { suggestionVal, imgList, toastOpen, toastTxt, toastIcon, effects } = this.props;
    return (
      <View className="suggestionWrap">
        <View className="areaWrap">
          <Textarea
            onInput={this.handleSuggestionChange.bind(this)}
            className="areaDom"
            maxlength="500"
            placeholder="请输入故障描述，以便我们尽快解决问题"
          />
          <View className="txtCounter">
            {suggestionVal.length}/
            <Text style={{ color: suggestionVal.length > 500 ? '#f00' : '#666' }}>500</Text>
          </View>
        </View>

        <View className="uploadWrap">
          <View className="uploadTitle">您最多可上传5张，单张图片最大1M</View>
          <View className="uploaderDom">
            <Upload onUploadCall={this.onUploadCall} imgList={imgList} />
          </View>
        </View>

        <View className="submitBtn" onClick={this.handleSubmit.bind(this)}>
          提交
        </View>

        <AtToast isOpened={toastOpen} text={toastTxt} icon={toastIcon} />

        <Loading isLoading={effects['suggestion/submit']} />
      </View>
    );
  }
}
