import { postRequest } from '../../utils/api';

const homepage = async(params) =>{
  return await postRequest('/userInfo', params);
};

export default homepage;
