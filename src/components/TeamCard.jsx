import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';

const TeamCard = ({ user }) => {
  const {
    name,
    skills = [],
    keywords = [],
    mainRole,
    subRole,
    rating,
    participation
  } = user;

  const isNewUser = !rating || rating === 0 || participation === 0;


  return (
    <div style={{
      background: '#FFF9F7',
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '1rem',
      boxShadow: '0 1px 5px rgba(0,0,0,0.06)',
      fontFamily: "'Noto Sans KR', 'Montserrat', Arial, sans-serif"
    }}>
      {/* 이름 + NEW 뱃지 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '0.5rem'
      }}>
        <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#333' }}>
          <PersonIcon style={{ verticalAlign: 'middle', marginRight: '0.3rem' }} />
          {name}
          {isNewUser && (
            <span style={{
              fontSize: '0.8rem',
              marginLeft: '0.5rem',
              background: '#FFEDD5',
              color: '#FF6B35',
              padding: '2px 6px',
              borderRadius: '12px'
            }}>
              NEW
            </span>
          )}
        </div>
      </div>

      {/* 정보 블록들 */}
      <div style={{ fontSize: '0.9rem', color: '#555', marginBottom: '0.3rem' }}>
        <strong>기술:</strong> {skills.length > 0 ? skills.join(', ') : '정보 없음'}
      </div>
      <div style={{ fontSize: '0.9rem', color: '#555', marginBottom: '0.3rem' }}>
        <strong>희망 역할군:</strong> {mainRole || '미입력'}
      </div>
      <div style={{ fontSize: '0.9rem', color: '#555', marginBottom: '0.3rem' }}>
        <strong>보조 가능 역할군:</strong> {subRole || '미입력'}
      </div>
      <div style={{ fontSize: '0.9rem', color: '#555', marginBottom: '0.3rem' }}>
        <strong>보유 역량:</strong> {keywords.length > 0 ? keywords.join(', ') : '없음'}
      </div>

      {/* 별점 & 참여 횟수 */}
      {isNewUser ? (
        <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.5rem' }}>
          ⭐ 아직 별점이 없습니다 / 첫 매칭 대기 중
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: '#666' }}>
          <div>
            ⭐ <strong>{rating.toFixed(1)}</strong>
          </div>
          <div>
            참여 <strong>{participation}</strong>회
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCard;
