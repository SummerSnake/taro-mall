import { getRequest } from '@/utils/api';

const coupon = async (params) => {
  return await getRequest('/coupon', params);
};

export default coupon;
