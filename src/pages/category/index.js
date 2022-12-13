import React, { useState, useEffect } from 'react';
import { View } from '@tarojs/components';
import { getCategoryListApi } from '@/services/category';
import { getGoodsListApi } from '@/services/good';

import NoData from '@/components/NoData/index';
import Loading from '@/components/Loading/index';
import Header from './components/Header/index';
import Classify from './components/Classify/index';
import GoodsList from './components/GoodsList/index';

import './index.scss';

function Category() {
  const [goodsList, setGoodsList] = useState([]);
  const [categoryList, setGategoryList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });

  /**
   * @desc 获取商品列表
   * @param { object } filters
   * @param { object } pagination
   * @return { void }
   */
  const fetchGoodsList = async (filters = filters, pagination = pagination) => {
    setLoading(true);
    const res = await getCategoryListApi({ pagination, filters });

    if (res?.status === 200) {
      const list = pagination.current > 1 ? [...goodsList, ...res?.data] : res?.data;
      setGoodsList(list);
    }

    setLoading(false);
  };

  /**
   * @desc 获取商品列表
   * @return { void }
   */
  const fetchCategoryList = async () => {
    setLoading(true);
    const res = await getGoodsListApi();

    if (res?.status === 200) {
      setGategoryList(res?.data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchGoodsList();
    fetchCategoryList();
  }, []);

  return (
    <View className="categoryWrap">
      <Header
        onHeaderCall={(json) => {
          setFilters({ ...filters, ...json });
          fetchGoodsList(json);
        }}
      />

      <Classify
        onClassifyCall={(json) => {
          setFilters({ ...filters, ...json });
          fetchGoodsList(json);
        }}
        classifyList={categoryList}
      />

      <GoodsList
        goodsList={goodsList}
        onGoodsCall={(json) => {
          if (json.type === 'loading') {
            setPagination((pagination.current += 1));
            fetchGoodsList(null, {
              ...pagination,
              current: (pagination.current += 1),
            });
          }
        }}
      />

      <Loading isLoading={loading} />

      <NoData isVisible={goodsList.length === 0} />
    </View>
  );
}

export default Category;
