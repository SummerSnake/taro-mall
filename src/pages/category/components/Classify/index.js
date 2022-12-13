import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { isNotNull } from '@/utils/util';
import './index.scss';

class Classify extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      titleArr: [
        { id: 1, title: '沉鱼落雁' },
        { id: 2, title: '蕙质兰心' },
        { id: 3, title: '绝代佳人' },
        { id: 4, title: '风姿卓约' },
      ],
      selectArr: [], // 当前选择的分类数组
      selectId: 0, // 当前点击的分类 id
      shadeVisible: false, // 子列表显示与否
      listItemActive: '', // 子列表所选项
      filter: null, // 筛选状态
    };
  }

  static defaultProps = {
    classifyList: [],
  };

  /**
   * 分类选择
   * @param id
   */
  selectTitle = async (id) => {
    const arr = [...this.state.selectArr];
    if (!arr.includes(id)) {
      arr.push(id);
    }
    this.setState({
      selectArr: arr,
      selectId: id,
      shadeVisible: true,
    });
  };

  /**
   * 分类列表项点击事件
   * @param id
   * @param title
   * @param e
   */
  listItemClick = async (id, title, e) => {
    e.stopPropagation();
    const arr = [...this.state.titleArr];
    arr.forEach((item) => {
      if (this.state.selectId === item.id) {
        item.title = title;
      }
    });
    this.setState({
      filter: id,
      listItemActive: id.toString(),
    });
  };

  /**
   * 分类列表取消
   * @param e
   */
  handleCancel = (e) => {
    e.stopPropagation();
    const arr = [...this.state.titleArr];
    const { selectId } = this.state;
    // 修改选中标题文字
    arr.forEach((item) => {
      if (selectId === item.id) {
        item.title =
          selectId === 1
            ? '沉鱼落雁'
            : selectId === 2
            ? '蕙质兰心'
            : selectId === 3
            ? '绝代佳人'
            : '风姿卓约';
      }
    });
    // 取消选中状态
    const selectedArr = [...this.state.selectArr];
    const newArr = selectedArr.filter((item) => item !== selectId);
    this.setState({
      selectArr: newArr,
      listItemActive: '',
      shadeVisible: false,
    });
  };

  /**
   * 分类列表确定
   * @param e
   */
  handleSelect = (e) => {
    e.stopPropagation();
    if (isNotNull(this.state.filter)) {
      // 筛选
      const json = {
        classifyFilter: this.state.filter,
      };
      this.props.onClassifyCall(json);
    } else {
      // 未筛选取消选中状态
      const selectedArr = [...this.state.selectArr];
      const newArr = selectedArr.filter((item) => item !== this.state.selectId);
      this.setState({
        selectArr: newArr,
      });
    }
    this.setState({
      shadeVisible: false,
    });
  };

  render() {
    const { classifyList } = this.props;
    const { titleArr, selectArr, listItemActive, shadeVisible } = this.state;
    return (
      <View className="classifyWrap">
        <View className="classifySelect">
          {titleArr.map((item) => (
            <View
              key={item.id}
              className={selectArr.includes(item.id) ? 'itemActive' : 'classifyItem'}
              onClick={this.selectTitle.bind(this, item.id)}
            >
              {item.title}
            </View>
          ))}
        </View>

        <View
          className="shadeDom"
          style={{ display: shadeVisible ? 'block' : 'none' }}
          onClick={this.handleCancel}
        >
          <View className="classifyList clearfix">
            {classifyList.map((item) => (
              <View
                key={item.id}
                className={
                  item.id.toString() === `${listItemActive}` ? 'listItemActive' : 'listItem'
                }
                onClick={this.listItemClick.bind(this, item.id, item.title)}
              >
                {item.title}
              </View>
            ))}
            <View className="btnGroup">
              <View className="cancelDom" onClick={this.handleCancel}>
                取消
              </View>
              <View className="submitDom" onClick={this.handleSelect}>
                确定
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default Classify;
