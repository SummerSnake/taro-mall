import React, { useState } from 'react';
import { View } from '@tarojs/components';
import { isNotNull } from '@/utils/util';
import './index.scss';

function Classify(props) {
  const { classifyList = [], onClassifyCall = () => {} } = props;

  const [titleArr, setTitleArr] = useState([
    { id: 1, title: '沉鱼落雁' },
    { id: 2, title: '蕙质兰心' },
    { id: 3, title: '绝代佳人' },
    { id: 4, title: '风姿卓约' },
  ]);
  const [selectedArr, setSelectedArr] = useState([]); // 当前选择的分类数组
  const [selectId, setSelectId] = useState(0); // 当前点击的分类 id
  const [shadeVisible, setShadeVisible] = useState(0); // 子列表显示与否
  const [listItemActive, setListItemActive] = useState(0); // 子列表所选项
  const [filter, setFilter] = useState(null); // 筛选状态

  /**
   * @desc 分类选择
   * @param { number } id
   * @return { void }
   */
  const handleClassifySelected = async (id) => {
    const arr = [...selectedArr];
    if (!arr.includes(id)) {
      arr.push(id);
    }
    setSelectedArr(arr);
    setSelectId(id);
    setShadeVisible(true);
  };

  /**
   * @desc 分类列表项点击事件
   * @param { number } id
   * @param { string } title
   * @param { object } e
   * @return { void }
   */
  const handleItemClick = async (id, title, e) => {
    e.stopPropagation();
    const arr = [...titleArr];

    arr.forEach((item) => {
      if (selectId === item.id) {
        item.title = title;
      }
    });

    setTitleArr(arr);
    setFilter(id);
    setListItemActive(id);
  };

  /**
   * @desc 分类列表取消
   * @param { object } e
   * @return { void }
   */
  const handleCancel = (e) => {
    e.stopPropagation();
    const arr = [...titleArr];

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
    const newArr = selectedArr.filter((item) => item !== selectId);

    setTitleArr(arr);
    setSelectedArr(newArr);
    setListItemActive(0);
    setShadeVisible(false);
  };

  /**
   * @desc 分类列表确定
   * @param { object } e
   * @return { void }
   */
  const handleSelect = (e) => {
    e.stopPropagation();

    if (isNotNull(filter)) {
      // 筛选
      onClassifyCall({ classifyFilter: filter });
    } else {
      // 未筛选取消选中状态
      const newArr = selectedArr.filter((item) => item !== selectId);
      setSelectedArr(newArr);
    }

    setShadeVisible(false);
  };

  return (
    <View className="classifyWrap">
      <View className="classifySelect">
        {Array.isArray(titleArr) &&
          titleArr.map((item) => (
            <View
              key={item.id}
              className={selectedArr.includes(item.id) ? 'itemActive' : 'classifyItem'}
              onClick={() => handleClassifySelected(item.id)}
            >
              {item.title}
            </View>
          ))}
      </View>

      <View
        className="shadeDom"
        style={{ display: shadeVisible ? 'block' : 'none' }}
        onClick={handleCancel}
      >
        <View className="classifyList clearfix">
          {Array.isArray(classifyList) &&
            classifyList.map((item) => (
              <View
                key={item.id}
                className={item.id === listItemActive ? 'listItemActive' : 'listItem'}
                onClick={() => handleItemClick(item.id, item.title)}
              >
                {item.title}
              </View>
            ))}

          <View className="btnGroup">
            <View className="cancelDom" onClick={handleCancel}>
              取消
            </View>
            <View className="submitDom" onClick={handleSelect}>
              确定
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default Classify;
