import React, { useState } from 'react';
import { View, Input, Text, Image } from '@tarojs/components';
import './index.scss';

function Header(props) {
  const { onHeaderCall = () => {} } = props;

  const [inputVal, setInputVal] = useState('');
  const [isReverse, setIsReverse] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  /**
   * @desc 点击排序
   * @param { number } type
   * @return { void }
   */
  const handleSort = (type) => {
    setIsReverse(type);

    onHeaderCall({
      searchVal: inputVal,
      type,
    });
  };

  return (
    <View className="cateHeader">
      <View className="searchDom clearfix">
        <Input
          className="inputDom"
          placeholder-class="placeClass"
          placeholder="请输入商品名称"
          onInput={(e) => setInputVal(e?.target?.value)}
          onFocus={() => setIsVisible(false)}
          onBlur={() => setIsVisible(true)}
        />
        <Image
          className="imgDom"
          style={{ display: isVisible && inputVal === '' ? 'block' : 'none' }}
          src="https://s1.ax1x.com/2020/06/01/tGthQK.png"
        />
        <Text onClick={() => onHeaderCall({ searchVal: inputVal })}>搜索</Text>
      </View>

      <View className="sortDom">
        <View className="sortItem" onClick={() => handleSort(0)}>
          <Text>综合</Text>
          <Image
            src="https://s1.ax1x.com/2020/06/01/tGtdzV.png"
            className={isReverse === 0 ? 'sortImgReverse' : 'sortImg'}
          />
        </View>
        <View className="sortItem" onClick={() => handleSort(1)}>
          <Text>销量</Text>
          <Image
            src="https://s1.ax1x.com/2020/06/01/tGtdzV.png"
            className={isReverse === 1 ? 'sortImgReverse' : 'sortImg'}
          />
        </View>
        <View className="sortItem" onClick={() => handleSort(2)}>
          <Text>价格</Text>
          <Image
            src="https://s1.ax1x.com/2020/06/01/tGtdzV.png"
            className={isReverse === 2 ? 'sortImgReverse' : 'sortImg'}
          />
        </View>
      </View>
    </View>
  );
}

export default Header;
