import * as qiniu from 'qiniu-js';

const token = 'wiHkNi3vsm20tQxU9Leo42qp9ZRTvkWOc5lW-W7j:-vtsGp_YnfainonOxIfIalZ9FRk=:eyJzY29wZSI6Im15LXRlc3QtcGsiLCJkZWFkbGluZSI6MTY4OTI2NTQ5MH0=';
const extra = {
  fname: '', // 文件名
  params: {}, // 自定义变量
  mimeType: ['audio/mpeg'], // null | array 为null时自动判断类型
};
const config = {
  shouldUseQiniuFileName: false,
  region: null,
};
const observer = {
  next(res) {
    console.log('next::', res);
    // 接收上传进度
  },
  error(error) {
    console.log('error::', error);
    // 上传失败
  },
  complete(res) {
    console.log('complete::', res);
    // 接收上传完成后的后端返回信息
  },
};

function useQiNiuUpload() {
  const uploadFile = ({ file, key }) => {
    // const path = 'pkyy/all/bookmp3/';
    const observable = qiniu.upload(
      file, // 上传的文件
      key, // 存储的文件路径和文件名
      token, // 存储的凭证
      extra,
      config,
    );
    return observable.subscribe(observer);
  };
  const uploadUrl = ({ file, key }) => {
    // const path = 'pkyy/all/bookmp3/';
    const observable = qiniu.upload(
      file, // 上传的文件
      key, // 存储的文件名
      token, // 存储的凭证、以及文件路径
      extra,
      config,
    );
    return observable.subscribe(observer);
  };
  const uploadBookMp3 = ({
    file, bookName, fileName, onError, onSuccess,
  }) => {
    const path = `pkyy/all/bookmp3/${bookName}/${fileName}`;
    const observable = qiniu.upload(
      file, // 上传的文件
      path, // 存储的文件名
      token, // 存储的凭证、以及文件路径
      extra,
      config,
    );
    return observable.subscribe({
      next(res) {
        console.log('next::', res);
        // 接收上传进度
      },
      error(error) {
        onError?.(error);
        // 上传失败
      },
      complete(res) {
        onSuccess?.(res);
        // 接收上传完成后的后端返回信息
      },
    });
  };

  return {
    uploadFile,
    uploadUrl,
    uploadBookMp3,
  };
}

export default useQiNiuUpload;
