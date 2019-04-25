import { postRequest } from '@/utils/api';

const goodsList = async params => {
  return await postRequest('/goodsList', params);
};

export default goodsList;
