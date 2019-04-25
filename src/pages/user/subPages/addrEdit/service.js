import { getRequest } from '@/utils/api';

const addrEdit = async params => {
  return await getRequest('/addrPage', params);
};

export default addrEdit;
