import { getRequest } from '@/utils/request';

// 获取优惠券列表
const getCouponListApi = async (params) => await getRequest('/coupon', params);

export { getCouponListApi };
