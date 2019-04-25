import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import './index.scss';

export default class CheckboxList extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      checkboxList: [],
      parentIds: [],
      childIds: [],
    };
  }

  componentDidMount = async () => {
    const { list } = this.props;
    if (Array.isArray(list) && list.length > 0) {
      const { parentIds, childIds } = this.state;
      // 存储 parentIds childIds 数组供 checkbox 使用
      list.forEach(item => {
        const { itemList } = item;
        parentIds.push(item.id);
        itemList.forEach(child => {
          childIds.push(child.id);
        });
      });
      this.setState({
        checkboxList: [...list],
        parentIds,
        childIds,
      });
    }
  };

  /**
   * 父级 checkbox
   * @param id
   * @param e
   */
  parentCheckboxClick = (id, e) => {
    e.stopPropagation();
    const { parentIds, childIds, checkboxList } = this.state;
    if (parentIds.indexOf(id) > -1) {
      // parentIds 数组中是否存在当前点击的 checkbox id
      parentIds.splice(parentIds.indexOf(id), 1); // 如果存在，则删除
      checkboxList.forEach(item => {
        // 取消当前点击的 checkbox 其所有子级 checkbox 选中状态
        if (item.id === id && item.itemList.length > 0) {
          const { itemList } = item;
          itemList.forEach(child => {
            childIds.splice(childIds.indexOf(child.id), 1);
          });
        }
      });
    } else {
      parentIds.push(id); // 如果 parentIds 数组中不存在当前点击的 checkbox id，则将其加入数组
      checkboxList.forEach(item => {
        // 为当前点击的 checkbox 其所有子级 checkbox 添加选中状态
        if (item.id === id && item.itemList.length > 0) {
          const { itemList } = item;
          itemList.forEach(child => {
            childIds.push(child.id);
          });
        }
      });
    }
    this.setState({
      parentIds,
      childIds,
    });
  };

  /**
   * 子级 checkbox
   * @param id
   * @param e
   */
  childCheckboxClick = (id, e) => {
    e.stopPropagation();
    const { parentIds, childIds, checkboxList } = this.state;
    if (childIds.indexOf(id) > -1) {
      // childIds 数组中是否存在当前点击的 checkbox id
      childIds.splice(childIds.indexOf(id), 1); // 如果有，则删除
      // childIds 数组中不存在当前点击的 checkbox 其父级的所有子级 id，取消其父级 checkbox 选中状态
      checkboxList.forEach(item => {
        const { itemList } = item;
        itemList.forEach(children => {
          if (children.id === id) {
            let flag = true;
            itemList.forEach(child => {
              if (childIds.indexOf(child.id) > -1) {
                flag = false;
              }
            });
            if (flag) {
              parentIds.splice(parentIds.indexOf(item.id), 1);
            }
          }
        });
      });
    } else {
      childIds.push(id); // 如果 childIds 数组中不存在当前点击的 checkbox id，则将其加入数组
      if (childIds.length > 0) {
        // 为当前选中 checkbox 的父级添加选中状态
        checkboxList.forEach(item => {
          const { itemList } = item;
          itemList.forEach(child => {
            // 查找到当前点击的 checkbox 父级，且 parentIds 数组中不存在其父级 id
            if (child.id === id && parentIds.indexOf(item.id) === -1) {
              parentIds.push(item.id);
            }
          });
        });
      }
    }
    this.setState({
      parentIds,
      childIds,
    });
  };

  render() {
    const { parentIds, childIds } = this.state;
    return (
      <View className="checkboxListWrap">
        {this.state.checkboxList.map(item => (
          <View className="itemWrap clearfix" key={item.id}>
            <View className="parentWrap">
              <View
                className={parentIds.indexOf(item.id) > -1 ? 'checkboxDomActive' : 'checkboxDom'}
                onClick={this.parentCheckboxClick.bind(this, item.id)}
              >
                <View style={{ display: parentIds.indexOf(item.id) > -1 ? 'block' : 'none' }}>
                  <AtIcon prefixClass="fa" value="checked" size="16" color="#fff" />
                </View>
              </View>
              <View className="checkboxTitle">{item.title}</View>
            </View>

            <View className="childWrap clearfix">
              {item.itemList.map(childItem => (
                <View className="childDom left" key={childItem.id}>
                  <View
                    className={
                      childIds.indexOf(childItem.id) > -1 ? 'checkboxDomActive' : 'checkboxDom'
                    }
                    onClick={this.childCheckboxClick.bind(this, childItem.id)}
                  >
                    <View
                      style={{ display: childIds.indexOf(childItem.id) > -1 ? 'block' : 'none' }}
                    >
                      <AtIcon prefixClass="fa" value="checked" size="16" color="#fff" />
                    </View>
                  </View>
                  <View className="checkboxTitle">{item.title}</View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    );
  }
}
