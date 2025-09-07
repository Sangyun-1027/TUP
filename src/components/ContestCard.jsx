import React from 'react';
import { calculateDday } from '../utils/dateUtils';

const ContestCard = ({ contest, onClick }) => {
  const { title, deadline, image } = contest;

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        background: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        overflow: 'hidden',
        height: '160px',
        minWidth: '100%',
      }}
    >
      {/* 공모전 이미지 */}
      <img
        src={image}
        alt={title}
        style={{
          width: '140px',
          height: '100%',
          objectFit: 'contain',
          backgroundColor: '#f4f4f4',
        }}
      />

      {/* 텍스트 영역 */}
      <div style={{
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        flex: 1
      }}>
        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{title}</h4>
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: '#555' }}>
          마감: {deadline} ({calculateDday(deadline)})
        </p>
      </div>
    </div>
  );
};

export default ContestCard;
