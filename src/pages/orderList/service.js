import { getRequest } from '@/utils/api';

const orderList = async (params) => {
  return await getRequest('/orderList', params);
};

export default orderList;
