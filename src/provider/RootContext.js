import React from 'react';

/**
 *
 * @type {React.Context<{container: {}, onChange:Function}>}
 */
const RootContext = React.createContext({
  container: document.body,
  onChange: null,
});

export const RootProvider = RootContext.Provider;

export const RootConsumer = RootContext.Consumer;

export default RootContext;
