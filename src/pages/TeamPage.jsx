import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import DrawerMenu from '../components/DrawerMenu';
import './TeamPage.css';

function TeamPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({});

  // 예시 팀원 데이터
  const teamMembers = [
    { id: 1, name : '이명준', mainRole : 'PM', subRole : '프론트엔드 개발', keywords : ['창의력', '실행력'], rating : 4.8, participation: 2 },
    { id: 2, name : '홍수아', mainRole : '백엔드 개발', subRole : '서버 구축', keywords : ['공감력', '기획력'], rating : 4.3, participation: 3 },
    { id: 3, name : '임수정', mainRole : '테스트 및 QA', subRole : 'DB 및 API 관리', keywords : ['친절함', '열정'], rating : 3.9, participation: 1 },
    { id: 23, name : '신유찬', mainRole : '프론트엔드 구현', subRole : '콘텐츠 편집', keywords : ['자기주도성', '논리력'], rating : 2.8, participation: 1 },

  ];

 
  return (
    <div className="team-page-container">
      {/* 상단 헤더 */}
      <header className="team-page-header">
        <span className="logo">TUP!</span>
        <button className="menu-button" onClick={() => setDrawerOpen(true)}>
          <MenuIcon style={{ fontSize: '2.2rem', color: '#FF6B35' }} />
        </button>
      </header>

      <DrawerMenu
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        openMenus={openMenus}
        onToggle={setOpenMenus}
      />

      <div className="teampage-main">
        <h1>🤝 나의 <span className="highlight">팀 프로젝트</span> 공간</h1>
        <p>진행 중인 팀 프로젝트 정보를 한눈에 확인하고 팀원들과 협업해보세요</p>
        </div>

      <div className="team-page-content">
        
        {/* 팀원 목록 */}
        <section className="team-section">
          <h2>👤 팀원 소개</h2>
          <ul className="member-list">
            {teamMembers.map(member => (
              <li key={member.id} className="member-card">
                <strong>{member.name}</strong>
                <p>희망 역할군 : {member.mainRole}</p>
                <p>보조 가능 역할군 : {member.subRole}</p>
                <p>키워드 : {member.keywords.join(', ')}</p>
                <p>참여 이력 : {member.participation}회</p>
                <p><strong>평점 :</strong> ⭐ {member.rating}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* 프로젝트 일정 */}
        <section className="team-section">
          <h2>🗓️ 일정 관리</h2>
          <p>공유 캘린더 기능이 이곳에 구현될 예정입니다.</p>
        </section>

        {/* 팀 게시판 */}
        <section className="team-section">
          <h2>📔 팀 게시판</h2>
          <p>업무, 공지사항, 회의록을 공유하는 공간입니다. (준비 중)</p>
        </section>

        {/* 채팅창 */}
        <section className="team-section">
          <h2>💬 팀 채팅</h2>
          <p>실시간 커뮤니케이션 채팅 기능이 추가될 예정입니다.</p>
        </section>
      </div>
    </div>
  );
}

export default TeamPage;
