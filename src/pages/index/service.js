import { postRequest } from '../../utils/api';

const homepage = async(params) =>{
  return await postRequest('/homePage', params);
};

export default homepage;
