import { getRequest } from '@/utils/request';

// 获取商品列表
const getGoodsListApi = async (params) => await getRequest('/goodsList', params);

export { getGoodsListApi };
