import React from 'react';

const Layout = ({ children }) => {
  // add `witcher-theme` to enable the global theme styles from index.css
  return <div className="app-shell witcher-theme p-0 px-4">{children}</div>;
};

export default Layout;
