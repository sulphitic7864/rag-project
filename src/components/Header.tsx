// src/components/Header.tsx
import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <div className="header">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Provincia_di_Catania-Stemma.svg/806px-Provincia_di_Catania-Stemma.svg.png"
        alt="Logo"
        className="logo"
      />
      <h1>Poc - Assistente digitale</h1>
    </div>
  );
};

export default Header;
