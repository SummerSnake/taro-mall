import { getRequest } from '@/utils/api';

const invoiceEdit = async (params) => {
  return await getRequest('/invoiceEdit', params);
};

export default invoiceEdit;
