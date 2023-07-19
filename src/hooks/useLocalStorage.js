function useLocalStorage() {
  const setString = (key, value) => window.localStorage.setItem(key, value);

  const getString = (key) => window.localStorage.getItem(key);

  const setBoolean = (key, value) => window.localStorage.setItem(key, value);

  const getBoolean = (key) => {
    const result = window.localStorage.getItem(key);
    return result === true || result === 'true' || result === '1';
  };

  const setObject = (key, value) => window.localStorage.setItem(key, JSON.stringify(value));

  const getObject = (key) => {
    const value = getString(key);
    if (value) {
      try {
        return JSON.parse(value);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  };

  const remove = (key) => window.localStorage.removeItem(key);

  return {
    setObject,
    getObject,
    setString,
    getString,
    setBoolean,
    getBoolean,
    remove,
  };
}

export default useLocalStorage;
