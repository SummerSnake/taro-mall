import { getRequest } from '@/utils/api';

const userEdit = async params => {
  return await getRequest('/userEdit', params);
};

export default userEdit;
