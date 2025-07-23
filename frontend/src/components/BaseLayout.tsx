import React from 'react';

const BaseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex relative h-screen w-screen items-center justify-center text-center bg-[url('/bike4.png')] bg-cover bg-no-repeat">
    {/* top-[7.5rem] is to account for the top bar height (5rem/80px) */}
    <div className="absolute top-[7.5rem] bottom-10 right-10 left-10 bg-[rgba(255,237,213,0.9)] rounded-md overflow-hidden">
      {children}
    </div>
  </div>
);

export default BaseLayout;
