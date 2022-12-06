import { getRequest } from '@/utils/api';

const phoneEdit = async params => {
  return await getRequest('/addrPage', params);
};

export default phoneEdit;
