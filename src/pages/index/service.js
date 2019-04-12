import { getRequest } from '../../utils/api';

const homepage = async (params) => {
  return await getRequest('/homePage', params);
};

export default homepage;
