import toast, { Toaster as ToastContainer } from 'react-hot-toast';

const toastContainerProps = {
  position: 'top-center',
  reverseOrder: false,
  gutter: 8,
  containerClassName: 'lx-toast',
  containerStyle: {},
  toastOptions: {
    // Define default options
    className: 'toast-content',
    duration: 5000,
    loading: {
      duration: 60000,
    },
    success: {
      duration: 3000,
    },
  },
};

function error(msg, opt) {
  toast.error(msg, opt || { className: 'toast-error' });
}

function info(msg, opt) {
  toast(msg, opt || { className: 'toast-info' });
}

function success(msg, opt) {
  toast.success(msg, opt || { className: 'toast-success' });
}

function loading(msg, opt) {
  toast.loading(msg, opt || { className: 'toast-loading' });
}

const POSITION = {
  TOP_CENTER: 'top-center',
};

export {
  toastContainerProps, ToastContainer, toast,
};
export default {
  error, info, success, loading, POSITION,
};
