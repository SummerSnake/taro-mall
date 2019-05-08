import { getRequest } from '@/utils/api';

const orderDetail = async params => {
  return await getRequest('/orderDetail', params);
};

export default orderDetail;
