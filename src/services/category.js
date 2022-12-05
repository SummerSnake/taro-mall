import { getRequest } from '@/utils/request';

// 获取商品列表
const getGoodsListApi = async (params) => await getRequest('/goodsList', params);

// 获取分类列表
const getCategoryListApi = async (params) => await getRequest('/classify', params);

// 获取用户信息

export { getGoodsListApi, getCategoryListApi };
