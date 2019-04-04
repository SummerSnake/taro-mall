import Taro from '@tarojs/taro';

export const apiUrl = 'https://www.easy-mock.com/mock/5c889485cecb1d3ecb3eb7f1/mall';

export function postRequest(url, params) {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: apiUrl + url,
      data: {
        ...params
      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
      }
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getRequest(url, params) {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: apiUrl + url,
      data: {
        ...params
      },
      method: 'GET',
    })
      .then(res => {
        resolve(res.data);
      })
      .catch(error => {
        reject(error);
      });
  });
}
