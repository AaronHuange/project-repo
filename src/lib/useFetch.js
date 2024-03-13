import Taro from '@tarojs/taro';
import { useCallback, useState } from 'react';

/** 开发时，需要再微信开发者工具的： 详情-本地设置 勾选不校验合法域名 项。 */
function useFetch({ url = 'https://www.test.com', httpOption } = {}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [error, setError] = useState({});
  const get = (uri = '') => new Promise((resolve, reject) => {
    const address = (uri.startsWith('http://') || uri.startsWith('https://')) ? uri : `${url}${uri}`;
    setLoading(true);
    Taro.request({
      url: address,
      method: 'GET',
      data: {},
      header: httpOption?.headers,
      success: function (res) {
        setLoading(false);
        setData(res.data);
        resolve(res.data);
      },
      fail: function (err) {
        setLoading(false);
        setError(err);
        reject(err);
      }
    });
  });

  const post = useCallback((uri, body) => new Promise((resolve, reject) => {
    const address = (uri.startsWith('http://') || uri.startsWith('https://')) ? uri : `${url}${uri}`;
    setLoading(true);
    Taro.request({
      url: address,
      method: 'POST',
      data: body,
      header: httpOption?.headers,
      success: function (res) {
        setLoading(false);
        setData(res.data);
        resolve(res.data);
      },
      fail: function (err) {
        setLoading(false);
        setError(err);
        reject(err);
      }
    });
  }), []);
  return {
    loading, get, post, data, error,
  }
}

export default useFetch;
