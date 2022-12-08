import { getRequest } from '@/utils/request';

// 获取用户信息
const getUserInfoApi = async (params) => await getRequest('/userInfo', params);

// 获取地址信息
const getAddressApi = async (params) => await getRequest('/addrPage', params);

// 修改地址信息
const updateAddressApi = async (params) => await getRequest('/addrPage', params);

// 删除地址信息
const deleteAddressApi = async (params) => await getRequest('/addrPage', params);

// 修改发票信息
const updateInvoiceApi = async (params) => await getRequest('/invoiceEdit', params);

// 修改手机号
const updatePhoneApi = async (params) => await getRequest('/addrPage', params);

// 提交反馈建议
const postSuggestionsApi = async (params) => await getRequest('/submitCallback', params);

// 提交反馈建议
const updateUserApi = async (params) => await getRequest('/userEdit', params);

export {
  getUserInfoApi,
  getAddressApi,
  updateAddressApi,
  deleteAddressApi,
  updateInvoiceApi,
  updatePhoneApi,
  postSuggestionsApi,
  updateUserApi,
};
