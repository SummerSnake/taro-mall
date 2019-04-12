import { getRequest, postRequest } from '../../utils/api';

const category = async (params) => {
  return await postRequest('/goodsList', params);
};

const classify = async (params) => {
  return await getRequest('/classify', params);
};

export { category, classify } ;
