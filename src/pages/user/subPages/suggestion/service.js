import { postRequest } from '@/utils/api';

const suggestion = async params => {
  return await postRequest('/submitCallback', params);
};

export default suggestion;
