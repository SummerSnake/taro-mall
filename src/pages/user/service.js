import { getRequest } from '../../utils/api';

const user = async(params) =>{
  return await getRequest('/userInfo', params);
};

export default user;
