import { getRequest } from '@/utils/request';

// 获取订单列表
const getOrderListApi = async (params) => await getRequest('/orderList', params);

// 获取订单详情
const getOrderInfoApi = async (params) => await getRequest('/orderDetail', params);

export { getOrderListApi, getOrderInfoApi };
