import { postRequest } from '../../utils/api';

const homepage = async(params) =>{
  return await postRequest('/homePage/getHomePageMsg', params);
};

export default homepage;
