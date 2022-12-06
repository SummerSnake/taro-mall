import { getRequest } from '@/utils/request';

// 获取首页数据
const getHomeDataApi = async (params) => await getRequest('/home', params);

export { getHomeDataApi };
