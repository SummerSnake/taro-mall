import { getRequest } from '@/utils/request';

// 获取分类列表
const getCategoryListApi = async (params) => await getRequest('/classify', params);

export { getCategoryListApi };
