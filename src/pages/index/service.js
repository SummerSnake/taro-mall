import { getRequest } from '@/utils/api';

const homepage = async (params) => await getRequest('/home', params);

export default homepage;
