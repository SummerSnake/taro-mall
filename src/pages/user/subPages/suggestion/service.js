import { getRequest } from '@/utils/api';

const suggestion = async params => {
  return await getRequest('/submitCallback', params);
};

export default suggestion;
