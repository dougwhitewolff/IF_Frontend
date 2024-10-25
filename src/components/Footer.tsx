// src/components/Footer.tsx

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{ backgroundColor: '#f0f0f0', padding: '10px', marginTop: '20px', textAlign: 'center' }}>
      <p>&copy; {new Date().getFullYear()} Inverse Functions App. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
