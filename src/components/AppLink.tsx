// src/app/components/AppLink.tsx

import Image from 'next/image';
import React from 'react';

interface AppLinkProps {
  icon: string;  // Path to the icon
  name: string;  // Name of the app
  appUrl: string; // URL scheme to open the app
  storeUrl: string; // Fallback URL for app store
}

const AppLink: React.FC<AppLinkProps> = ({ icon, name, appUrl, storeUrl }) => {
  const openApp = () => {
    // Attempt to open the app
    const timeout = setTimeout(() => {
      window.location.href = storeUrl; // Redirect to app store
    }, 2000);

    window.location.href = appUrl; // Attempt to open the app

    // Clear the timeout if the app opens
    window.addEventListener('pagehide', () => {
      clearTimeout(timeout);
    });
  };

  return (
    <div onClick={openApp} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
      <Image src={icon} alt={name} width={40} height={40} />
      <span style={{ marginLeft: '10px' }}>{name}</span>
    </div>
  );
};

export default AppLink;