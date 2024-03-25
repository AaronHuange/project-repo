import Taro from '@tarojs/taro';
import { useCallback, useState } from 'react';

/** 开发时，需要再微信开发者工具的： 详情-本地设置 勾选不校验合法域名 项。 */
function useFetch({ url = HOST, httpOption = null } = {}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [error, setError] = useState({});

  const taroRequest = ({ path, method, body }) => {
    const fullUrl = (path.startsWith('http://') || path.startsWith('https://')) ? path : `${url}${path}`;
    return new Promise((resolve, reject) => {
      setLoading(true);
      Taro.request({
        url: fullUrl,
        method: method,
        data: body,
        header: {
          // Authorization: 'Token token=',
          ...httpOption?.headers || {},
        },
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
      })
    });
  }

  const get = useCallback((path = '') => taroRequest({
    method: 'GET',
    path,
    body: null
  }), [url, httpOption]);

  const post = useCallback((path, body) => taroRequest({
    method: 'POST',
    path,
    body,
  }), [url, httpOption]);

  const put = useCallback((path, body) => taroRequest({
    method: 'PUT',
    path,
    body,
  }), [url, httpOption]);

  const patch = useCallback((path, body) => taroRequest({
    method: 'PATCH',
    path,
    body,
  }), [url, httpOption]);

  const deleteRequest = useCallback((path, body) => taroRequest({
    method: 'PUT',
    path,
    body,
  }), [url, httpOption]);

  // 通用 request
  const request = useCallback((option) => taroRequest({
    method: option.method,
    path: option.path,
    body: option.body,
  }), [url, httpOption]);

  return {
    loading,
    data,
    get,
    post,
    put,
    patch,
    delete: deleteRequest,
    request,
    error,
  }
}

export default useFetch;
