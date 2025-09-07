import React from 'react';
import PersonIcon from '@mui/icons-material/Person';

const TeamList = ({ matched, feedbacks, onFeedback, currentUser }) => {
  // 현재 유저가 속한 팀을 찾음
  const myTeamIndex = matched.findIndex(team =>
    team.some(member => member.id === currentUser?.id)
  );

  const myTeam = myTeamIndex !== -1 ? matched[myTeamIndex] : null;

  // 나머지 팀 목록 (내 팀 제외)
  const otherTeams = matched.filter((_, idx) => idx !== myTeamIndex);
  
  // 신규 유저
 

  // 팀 렌더링 함수
  const renderTeam = (team, index, isMyTeam = false) => {
    const sortedTeam = [...team].sort((a, b) => {
      if (a.id === currentUser?.id) return -1;
      if (b.id === currentUser?.id) return 1;
      return 0;
    });

    return (
      <div
        key={index}
        style={{
          border: '2px solid #ccc',
          borderRadius: '10px',
          padding: '1rem',
          marginBottom: '1.5rem',
          backgroundColor: isMyTeam ? '#FFF1EC' : 'white'
        }}
      >
        <h3 style={{
          fontWeight: 700,
          fontSize: '1.1rem',
          color: isMyTeam ? '#FF6B35' : '#333'
        }}>
          {isMyTeam ? '⭐ 내 팀 정보' : `${index + 1}팀`}
        </h3>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {sortedTeam.map(member => (
            <li
              key={member.id}
              style={{
                padding: '1rem 0',
                borderBottom: '1px solid #eee',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.3rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon style={{ marginRight: '0.3rem', color: '#444' }} />
                <strong style={{ fontSize: '1.05rem' }}>
                  {member.name}{member.id === currentUser?.id ? "" : ""}
                </strong>
                 {(member.rating === undefined || member.participation === undefined) && (
                  <span
                    style={{
                      backgroundColor: '#FF6B35',
                      color: 'white',
                      fontSize: '0.75rem',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    NEW
                  </span>
                )}
              </div>

              <div style={{ paddingLeft: '1.5rem' }}>
                <p><strong>희망 역할군:</strong> {member.mainRole || '입력 없음'}</p>
                <p><strong>보조 가능 역할군:</strong> {member.subRole || '입력 없음'}</p>
                <p><strong>보유 역량:</strong> {member.keywords?.join(', ') || '없음'}</p>

                {member.rating !== undefined && member.participation !== undefined ? (
                  <p style={{ marginTop: '0.3rem', color: '#666' }}>
                    ⭐{member.rating.toFixed(1)} ({member.participation}회 참여)
                  </p>
                ) : (
                  <p style={{ color: '#aaa' }}>⭐ 아직 별점이 없어요 / 첫 매칭 대기 중</p>
                )}
              </div>

           <div style={{ marginTop: '0.3rem', paddingLeft: '1.5rem' }}>
            // 클릭 시, 상위에서 API 호출로 처리 예정
                <button
                  onClick={() => onFeedback(member.id, '👍')}  // ← 나중에 axios 요청으로 대체
                  style={{
                    marginRight: '0.5rem',
                    backgroundColor: feedbacks[member.id] === '👍' ? '#FF6B35' : 'white',
                    color: feedbacks[member.id] === '👍' ? 'white' : 'black',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    padding: '0.4rem 0.8rem',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  👍
                </button>
                <button
                  onClick={() => onFeedback(member.id, '👎')}  // ← 나중에 axios 요청으로 대체
                  style={{
                    backgroundColor: feedbacks[member.id] === '👎' ? '#FF6B35' : 'white',
                    color: feedbacks[member.id] === '👎' ? 'white' : 'black',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    padding: '0.4rem 0.8rem',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  👎
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div>
      {myTeam && renderTeam(myTeam, myTeamIndex, true)}
      {otherTeams.map((team, idx) => renderTeam(team, idx))}
    </div>
  );
};

export default TeamList;
