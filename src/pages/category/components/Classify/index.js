import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import './index.scss';

export default class Classify extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      isActiveOne: false,
      largeTxt: '',
      isActiveTwo: false,
      smallTxt: '',
      isActiveThree: false,
      weightTxt: '',
      isActiveFour: false,
      packTxt: '',
      shadeVisible: false,
      listItemActive: '',
      type: 0,
      filter: null,
    };
  }

  static defaultProps = {
    classifyList: [],
  };

  /**
   * 大类选择
   */
  selectOne = async () => {
    this.setState({
      type: 0,
      shadeVisible: true,
    });
  };

  /**
   * 细分类选择
   */
  selectTwo = async () => {
    this.setState({
      type: 1,
      shadeVisible: true,
    });
  };

  /**
   * 重量选择
   */
  selectThree = async () => {
    this.setState({
      type: 2,
      shadeVisible: true,
    });
  };

  /**
   * 包装选择
   */
  selectFour = async () => {
    this.setState({
      type: 3,
      shadeVisible: true,
    });
  };

  /**
   * 关闭类型列表
   */
  handleCancel = () => {
    this.setState({
      shadeVisible: false,
    });
    this.props.onClassifyCall({ filter: this.state.filters });
    switch (this.state.type) {
      case 0:
        this.setState({
          largeTxt: '',
          isActiveOne: false,
        });
        break;
      case 1:
        this.setState({
          smallTxt: '',
          isActiveTwo: false,
        });
        break;
      case 2:
        this.setState({
          weightTxt: '',
          isActiveThree: false,
        });
        break;
      case 3:
        this.setState({
          packTxt: '',
          isActiveFour: false,
        });
        break;
      default:
        this.setState({
          largeTxt: '',
          smallTxt: '',
          weightTxt: '',
          packTxt: '',
          isActiveOne: false,
          isActiveTwo: false,
          isActiveThree: false,
          isActiveFour: false,
        });
    }
  };

  /**
   * 类型列表项点击事件
   * @param id
   * @param title
   * @param e
   */
  listItemClick = async (id, title, e) => {
    e.stopPropagation();
    switch (this.state.type) {
      case 0:
        this.setState({
          filter: id,
          isActiveOne: true,
          largeTxt: title,
        });
        break;
      case 1:
        this.setState({
          filter: id,
          isActiveTwo: true,
          smallTxt: title,
        });
        break;
      case 2:
        this.setState({
          filter: id,
          isActiveThree: true,
          weightTxt: title,
        });
        break;
      case 3:
        this.setState({
          filter: id,
          isActiveFour: true,
          packTxt: title,
        });
        break;
      default:
        this.setState({
          largeTxt: '',
          smallTxt: '',
          weightTxt: '',
          packTxt: '',
          filter: '',
        });
    }
    this.setState({
      listItemActive: id.toString(),
    });
  };

  /**
   * 确定
   * @param e
   */
  handleSelect = (e) => {
    e.stopPropagation();
    const json = {
      filter: this.state.filter,
    };
    this.props.onClassifyCall(json);
    this.setState({ shadeVisible: false });
  };

  render() {
    const { classifyList } = this.props;
    const { listItemActive, shadeVisible } = this.state;
    return (
      <View className='classifyWrap'>
        <View className='classifySelect'>
          <View
            className={this.state.isActiveOne ? 'itemActive' : 'classifyItem'}
            onClick={this.selectOne}
          >
            {this.state.largeTxt === '' ? '大类' : this.state.largeTxt}
          </View>
          <View
            className={this.state.isActiveTwo ? 'itemActive' : 'classifyItem'}
            onClick={this.selectTwo}
          >
            {this.state.smallTxt === '' ? '细分类' : this.state.smallTxt}
          </View>
          <View
            className={this.state.isActiveThree ? 'itemActive' : 'classifyItem'}
            onClick={this.selectThree}
          >
            {this.state.weightTxt === '' ? '重量' : this.state.weightTxt}
          </View>
          <View
            className={this.state.isActiveFour ? 'itemActive' : 'classifyItem'}
            onClick={this.selectFour}
          >
            {this.state.packTxt === '' ? '包装' : this.state.packTxt}
          </View>
        </View>
        <View
          className='shadeDom'
          style={{ display: shadeVisible ? 'block' : 'none' }}
          onClick={this.handleCancel}
        >
          <View className='classifyList clearfix'>
            {
              classifyList.map((item) => {
                return (
                  <View
                    key={item.id}
                    className={item.id.toString() === `${listItemActive}` ? 'listItemActive' : 'listItem'}
                    onClick={this.listItemClick.bind(this, item.id, item.title)}
                  >
                    {item.title}
                  </View>
                );
              })
            }
            <View className='btnGroup'>
              <View className='cancelDom' onClick={this.handleCancel}>取消</View>
              <View className='submitDom' onClick={this.handleSelect}>确定</View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
