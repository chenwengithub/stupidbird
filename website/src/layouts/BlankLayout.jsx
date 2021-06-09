import React from 'react';
import { Inspector } from 'react-dev-inspector';
const InspectorWrapper = process.env.NODE_ENV === 'development' ? Inspector : React.Fragment;
console.log(process.env.NODE_ENV)
const Layout = ({ children }) => {
  return <InspectorWrapper>{children}</InspectorWrapper>;
};

export default Layout;
