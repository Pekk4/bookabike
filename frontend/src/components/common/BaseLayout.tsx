import React from 'react';

/**
 * BaseLayout component that provides a base layout for the application.
 * It includes a background image and a centered content area, where the children
 * components are rendered.
 *
 * @param children - The content to be displayed within the layout.
 */
const BaseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className="
      flex relative h-screen w-screen items-center justify-center
      text-center bg-[url('/bike4.png')] bg-cover bg-no-repeat
    "
  >
    {/* top-[7.5rem] is to account for the top bar height (5rem/80px) */}
    <div
      className="
        absolute top-[7.5rem] bottom-10 right-10 left-10 bg-[rgba(255,237,213,0.8)]
        rounded-md overflow-hidden border-1 border-orange-500
        shadow-[0_4px_30px_1px_rgba(249,115,22,0.7)]
      "
    >
      {children}
    </div>
  </div>
);

export default BaseLayout;
