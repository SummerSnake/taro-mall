import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { AtIcon, AtToast } from 'taro-ui';
import './index.scss';

class Upload extends Component {
  constructor(props) {
    super(props);
    let imgList = [];
    let isVisible = true;
    if (Array.isArray(props.imgList) && props.imgList.length > 0) {
      imgList = props.imgList;
      if (imgList.length > 4) {
        isVisible = false;
      }
    }
    this.state = {
      isOpen: false,
      toastTxt: '',
      toastIcon: '',
      isVisible,
      imgList,
    };
  }

  componentWillReceiveProps = nextProps => {
    const propsList = nextProps.imgList;
    if (Array.isArray(propsList) && propsList.length > 0) {
      this.setState({
        imgList: [...propsList],
      });
      if (propsList.length > 4) {
        this.setState({
          isVisible: false,
        });
      }
    }
  };

  /**
   * 上传图片
   */
  chooseImage = async e => {
    e.stopPropagation();
    // 上传图片
    let res = await Taro.chooseImage({
      count: 5, //
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    });
    if (res.tempFiles[0].size > 1048576) {
      this.toastFunc('图片大小不能超过1M', 'close-circle');
    } else {
      const list = [...this.state.imgList];
      list.push(res.tempFiles[0].path);
      this.setState({
        imgList: [...list],
      });
      if (list.length > 4) {
        this.setState({
          isVisible: false,
        });
      }
      this.props.onUploadCall(list);
    }
  };

  /**
   * 删除图片
   */
  removeImage = (index, e) => {
    e.stopPropagation();
    const list = [...this.state.imgList];
    list.splice(index, 1);
    this.setState({
      imgList: [...list],
      isVisible: true,
    });
    this.props.onUploadCall(list);
  };

  /**
   * toast 弹出
   */
  toastFunc = (toastTxt, toastIcon) => {
    this.setState({
      toastTxt,
      toastIcon,
    });
    this.setState({ isOpen: true });
    setTimeout(() => {
      this.setState({ isOpen: false });
    }, 2000);
  };

  render() {
    return (
      <View className="uploadWrap">
        {this.state.imgList.map((item, index) => {
          return (
            <View className="imgDom left" key={index.toString()}>
              <Image src={item} />
              <View className="cancelIcon" onClick={this.removeImage.bind(this, index)}>
                <AtIcon value="close-circle" size="12" />
              </View>
            </View>
          );
        })}
        {this.state.isVisible && (
          <View className="addDom left" onClick={this.chooseImage}>
            <AtIcon value="add" size="30" />
          </View>
        )}

        <AtToast
          isOpened={this.state.isOpen}
          text={this.state.toastTxt}
          icon={this.state.toastIcon}
        />
      </View>
    );
  }
}

export default Upload;
