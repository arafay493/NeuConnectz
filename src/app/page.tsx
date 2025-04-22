// Note: AppLayOut component...!

import React, { ReactNode } from 'react';

const AppLayOut = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default AppLayOut;