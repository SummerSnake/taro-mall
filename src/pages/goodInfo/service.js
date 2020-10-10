import { getRequest } from '@/utils/api';

const goodsList = async params => {
  return await getRequest('/goodsList', params);
};

export default goodsList;
