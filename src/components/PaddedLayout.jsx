import React from 'react';

const PaddedLayout = ({ children }) => {
  return (
    <div className="max-w-screen-lg mx-auto px-6">
      {children}
    </div>
  );
};

export default PaddedLayout;
