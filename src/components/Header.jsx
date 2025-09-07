// src/components/Header.jsx
import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';

const Header = ({ onMenuOpen }) => {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.9)',
      padding: '1.5rem 2rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative'
    }}>
      <span style={{
        fontFamily: "'Montserrat', 'Noto Sans KR', Arial, sans-serif",
        fontWeight: 900,
        fontSize: '2.3rem',
        color: '#FF6B35',
        letterSpacing: '0.13em',
        textTransform: 'uppercase',
        margin: 0,
        textShadow: '1px 1px 2px rgba(0,0,0,0.08)'
      }}>
        TUP!
      </span>
      {!onMenuOpen ? null : (
        <button
          onClick={onMenuOpen}
          style={{
            background: 'none',
            border: 'none',
            position: 'absolute',
            right: '2rem',
            top: '50%',
            transform: 'translateY(-50%)',
            cursor: 'pointer',
            padding: 0,
            zIndex: 2010
          }}
          aria-label="메뉴 열기"
        >
          <MenuIcon style={{ fontSize: '2.2rem', color: '#FF6B35' }} />
        </button>
      )}
    </div>
  );
};

export default Header;
