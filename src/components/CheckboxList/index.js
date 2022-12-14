import React, { useState, useEffect } from 'react';
import { View } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import './index.scss';

function CheckboxList(props) {
  const [checkboxList, setCheckboxList] = useState([]);
  const [parentIds, setParentIds] = useState([]);
  const [childIds, setChildIds] = useState([]);

  /**
   * @desc 父级 checkbox
   * @param { number } id
   * @return { void }
   */
  const parentCheckboxClick = (id) => {
    e.stopPropagation();
    const parentIdArr = [...parentIds];
    const childIdArr = [...childIds];

    if (parentIdArr.indexOf(id) > -1) {
      // parentIds 数组中是否存在当前点击的 checkbox id
      parentIdArr.splice(parentIdArr.indexOf(id), 1); // 如果存在，则删除

      checkboxList.forEach((item) => {
        // 取消当前点击的 checkbox 其所有子级 checkbox 选中状态
        if (item.id === id && item?.itemList.length > 0) {
          const { itemList } = item;

          itemList.forEach((child) => {
            childIdArr.splice(childIdArr.indexOf(child.id), 1);
          });
        }
      });
    } else {
      parentIdArr.push(id); // 如果 parentIds 数组中不存在当前点击的 checkbox id，则将其加入数组

      checkboxList.forEach((item) => {
        // 为当前点击的 checkbox 其所有子级 checkbox 添加选中状态
        if (item.id === id && item.itemList.length > 0) {
          const { itemList } = item;

          itemList.forEach((child) => {
            childIdArr.push(child.id);
          });
        }
      });
    }

    setParentIds(parentIdArr);
    setChildIds(childIdArr);
  };

  /**
   * @desc 子级 checkbox
   * @param { number } id
   * @return { void }
   */
  const childCheckboxClick = (id) => {
    e.stopPropagation();
    const parentIdArr = [...parentIds];
    const childIdArr = [...childIds];

    if (childIdArr.indexOf(id) > -1) {
      // childIds 数组中是否存在当前点击的 checkbox id
      childIdArr.splice(childIdArr.indexOf(id), 1); // 如果有，则删除
      // childIds 数组中不存在当前点击的 checkbox 其父级的所有子级 id，取消其父级 checkbox 选中状态
      checkboxList.forEach((item) => {
        const { itemList } = item;

        itemList.forEach((children) => {
          if (children.id === id) {
            if (itemList.some((child) => childIdArr.includes(child.id))) {
              parentIdArr.splice(parentIdArr.indexOf(item.id), 1);
            }
          }
        });
      });
    } else {
      childIdArr.push(id); // 如果 childIds 数组中不存在当前点击的 checkbox id，则将其加入数组
      if (childIdArr.length > 0) {
        // 为当前选中 checkbox 的父级添加选中状态
        checkboxList.forEach((item) => {
          const { itemList } = item;
          itemList.forEach((child) => {
            // 查找到当前点击的 checkbox 父级，且 parentIds 数组中不存在其父级 id
            if (child.id === id && parentIdArr.indexOf(item.id) === -1) {
              parentIdArr.push(item.id);
            }
          });
        });
      }
    }

    setParentIds(parentIdArr);
    setChildIds(childIdArr);
  };

  useEffect(() => {
    if (Array.isArray(props?.list) && props?.list.length > 0) {
      const parentIdArr = [...parentIds];
      const childIdArr = [...childIds];

      // 存储 parentIds childIds 数组供 checkbox 使用
      props.list.forEach((item) => {
        const { itemList } = item;
        parentIdArr.push(item.id);

        itemList.forEach((child) => {
          childIdArr.push(child.id);
        });
      });

      setCheckboxList(props.list);
      setParentIds(parentIdArr);
      setChildIds(childIdArr);
    }
  }, []);

  return (
    <View className="checkboxListWrap">
      {Array.isArray(checkboxList) &&
        checkboxList.map((item) => (
          <View className="itemWrap clearfix" key={item.id}>
            <View className="parentWrap">
              <View
                className={parentIds.indexOf(item.id) > -1 ? 'checkboxDomActive' : 'checkboxDom'}
                onClick={() => parentCheckboxClick(item.id)}
              >
                <View style={{ display: parentIds.indexOf(item.id) > -1 ? 'block' : 'none' }}>
                  <AtIcon prefixClass="fa" value="checked" size="16" color="#fff" />
                </View>
              </View>
              <View className="checkboxTitle">{item.title}</View>
            </View>

            <View className="childWrap clearfix">
              {item?.itemList.map((childItem) => (
                <View className="childDom left" key={childItem.id}>
                  <View
                    className={
                      childIds.indexOf(childItem.id) > -1 ? 'checkboxDomActive' : 'checkboxDom'
                    }
                    onClick={() => childCheckboxClick(childItem.id)}
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

export default CheckboxList;
