import { postRequest } from '../../utils/api';

const user = async(params) =>{
  return await postRequest('/userInfo', params);
};

export default user;
