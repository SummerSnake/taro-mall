import { getRequest } from '@/utils/request';

// 发送验证码
const getSendSmsCodeApi = async (params) => await getRequest('/addrPage', params);

export { getSendSmsCodeApi };
