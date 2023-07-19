import React from 'react';
import { VscLoading } from 'react-icons/vsc';
import { createPortal } from 'react-dom';
import RootContext from '@/provider/RootContext';

function DefaultModal({
  title = null,
  children = null,
  onClose = null,
  onConfirm = null,
  loading = false,
  displayFooter = true,
  confirmText = '确认',
  cancelText = '取消',
  confirmType = 'danger',
  checkType = '',
  checkLabel = '',
  cancelBtnClassName = 'btn btn-default sm:w-20 sm:mr-2 w-1/2 !text-base border-r rounded-none rounded-bl-lg sm:border sm:rounded',
  confirmBtnClassname = '',
  portal = false,
  contentWidth = null,
}) {
  const { container } = React.useContext(RootContext);
  const portalDevRef = React.useRef();
  if (portal && !portalDevRef.current) {
    const newDiv = document.createElement('div');
    container.appendChild(newDiv);
    portalDevRef.current = newDiv;
  }
  // unmount 销毁
  React.useEffect(() => (() => (portalDevRef.current && portalDevRef.current.remove())));

  const [checkFlag, setCheckFlag] = React.useState(false);
  const okBtnClassname = React.useMemo(() => {
    switch (confirmType) {
      case 'danger':
        return 'btn-danger rounded-br-lg sm:rounded-br';
      default:
        return 'btn-primary sm:bg-primary-500 sm:text-white sm:hover:bg-primary-600 text-primary-500';
    }
  }, [confirmType]);
  const dom = (
    <div className="modal modal-alert">
      <div
        className="absolute inset-0 bg-transparent"
        onClick={onClose}
        data-toggle-dismiss="modal"
      />

      <div className="modal-dialog h-full flex flex-col justify-center">
        <div className="modal-content w-full" style={{ maxWidth: '80vw', width: contentWidth }}>
          <div className="flex items-center justify-between px-5 py-3 rounded-t dark:bg-dark-400 dark:border-b dark:border-b-dark-500">
            <h3 className="font-semibold text-lg dark:text-dark-900">{title}</h3>
            <button
              type="button"
              className="modal-button-close hidden sm:flex"
              onClick={onClose}
              data-toggle-dismiss="modal"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="modal-body">
            {children}
            {checkType === 'checkbox' && (
              <div className="form-check flex items-center">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={checkFlag}
                  id="confirm-check"
                  onChange={(e) => setCheckFlag(e.target.checked)}
                />
                <label
                  htmlFor="confirm-check"
                  className="form-check-label inline-block text-gray-800"
                >
                  {checkLabel || '同意'}
                </label>
              </div>
            )}
          </div>

          {displayFooter && (
            <div className="flex sm:p-5 sm:justify-end justify-between border-t sm:border-t-0 h-14 sm:h-auto">
              {cancelText && (
                <button
                  type="button"
                  className={cancelBtnClassName}
                  onClick={onClose}
                >
                  {cancelText}
                </button>
              )}
              {confirmText && (
                <button
                  type="button"
                  className={`btn sm:w-20 !text-base w-1/2 ${okBtnClassname} ${confirmBtnClassname}`}
                  onClick={onConfirm}
                  disabled={(checkType && !checkFlag) || loading}
                >
                  {loading ? <VscLoading className="animate-spin w-4 h-4" /> : confirmText}
                </button>
              )}
            </div>)}
        </div>
      </div>
    </div>
  );

  if (portal && portalDevRef.current) {
    return createPortal(dom, portalDevRef.current);
  }
  return dom;
}

export default DefaultModal;
