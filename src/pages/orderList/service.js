import { postRequest } from '../../utils/api';

const orderList = async(params) =>{
  return await postRequest('/orderList', params);
};

export default orderList;
