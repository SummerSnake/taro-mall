import { getRequest } from '@/utils/api';

const addrPage = async (params) => {
  return await getRequest('/addrPage', params);
};

export default addrPage;
