import { useSearchParams as useReactRouterSearchParams } from 'react-router-dom';

function useSearchParams() {
  const [searchParams, setSearchParamsFn] = useReactRouterSearchParams();
  const setSearchParams = (params) => {
    const fullParams = Object.fromEntries(searchParams.entries());
    setSearchParamsFn({ ...fullParams, ...params });
  };
  return {
    searchParams,
    setSearchParams,
  };
}

export default useSearchParams;
