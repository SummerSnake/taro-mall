import { getRequest } from '@/utils/api';

const category = async params => {
  return await getRequest('/goodsList', params);
};

const classify = async params => {
  return await getRequest('/classify', params);
};

export { category, classify };
