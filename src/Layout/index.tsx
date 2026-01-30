import React from "react";

import { Outlet } from "react-router-dom";

const LayoutPages: React.FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};
export default LayoutPages;
