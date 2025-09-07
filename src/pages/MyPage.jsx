import React, { useState } from 'react';
import './MyPage.css';
import MenuIcon from '@mui/icons-material/Menu';
import DrawerMenu from '../components/DrawerMenu';


const MyPage = ({
  user = { name : '이명준', intro : "TUP! 개발중", skills : ["React", "Node.js"], mainRole : 'PM', subRole : '프론트엔드 개발', rating: 4.8 },
  appliedTeams = [],
  invitedTeams = [],
  acceptedTeams = [],
  rejectedTeams = [],
  myTeam = null,
  stats = { totalApplied: 0, totalInvited: 0, acceptRate: 0 }
}) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({});

  return (
    <div className="team-matching-container">
      <header className="team-matching-header">
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

      <div className="mypage-main">
        <h1>📙 마이페이지</h1>
        <p>마이페이지에서는 나의 프로필과 팀 활동 현황을 한눈에 확인할 수 있어요</p>
      </div>

      <div className="mypage-content">
        <div className="mypage-box">
          <div className="mypage-box-header">
            <div>
              <h2>{user.name} 님</h2>
              <div className="mypage-tabs">
                <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>내 프로필</button>
                <button className={activeTab === 'project' ? 'active' : ''} onClick={() => setActiveTab('project')}>내 프로젝트</button>
              </div>
            </div>
            <div className="mypage-status">
              <span className="invite-count">📂 초대 1건</span>
              <span className="alert-count">🔔 알림 5건</span>
              <span className="status-pill">🟢 활동 중</span>
            </div>
          </div>

          {activeTab === 'profile' && (
            <>
              <p>{user.intro || "자기소개를 입력해 주세요."}</p>
              <p><strong>기술 스택 :</strong> {user.skills.join(', ')}</p>
              <p><strong>희망 역할군 :</strong> {user.mainRole}</p>
              <p><strong>보조 가능 역할군 :</strong> {user.subRole}</p>
              <p><strong>평점 :</strong> ⭐ {user.rating}</p>
              <button className="mypage-button">프로필 수정</button>
            </>
          )}

          {activeTab === 'project' && (
            <>
              {myTeam && (
                <div className="mypage-box">
                  <h3>📌 현재 참여 중인 팀</h3>
                  <p><strong>팀명:</strong> {myTeam.name}</p>
                  <p><strong>팀장:</strong> {myTeam.leader}</p>
                  <p><strong>역할:</strong> {myTeam.myRole}</p>
                  <p><strong>팀원:</strong> {myTeam.members.join(', ')}</p>
                  <button className="mypage-button">팀 채팅방 입장</button>
                </div>
              )}

              <div className="mypage-box">
                <h3>📊 매칭 통계</h3>
                <p>총 지원한 팀: {stats.totalApplied}개</p>
                <p>초대 받은 횟수: {stats.totalInvited}회</p>
                <p>수락률: {stats.acceptRate}%</p>
              </div>

              <div className="mypage-box">
                <h3>📥 내가 신청한 팀</h3>
                {appliedTeams.length > 0 ? (
                  appliedTeams.map((team, idx) => (
                    <div key={idx} className="mypage-card">
                      <p><strong>{team.name}</strong> (상태: {team.status})</p>
                    </div>
                  ))
                ) : <p>신청 내역이 없습니다.</p>}
              </div>

              <div className="mypage-box">
                <h3>📨 나를 초대한 팀</h3>
                {invitedTeams.length > 0 ? (
                  invitedTeams.map((team, idx) => (
                    <div key={idx} className="mypage-card">
                      <p><strong>{team.name}</strong> - 팀장: {team.leader}</p>
                      <div>
                        <button className="mypage-button">수락</button>
                        <button className="mypage-button reject">거절</button>
                      </div>
                    </div>
                  ))
                ) : <p>초대 내역이 없습니다.</p>}
              </div>

              <div className="mypage-box">
                <h3>✅ 수락한 팀</h3>
                {acceptedTeams.length > 0 ? (
                  acceptedTeams.map((team, idx) => (
                    <div key={idx} className="mypage-card">
                      <p><strong>{team.name}</strong> - 수락 완료</p>
                    </div>
                  ))
                ) : <p>수락한 내역이 없습니다.</p>}
              </div>

              <div className="mypage-box">
                <h3>❌ 거절한 팀</h3>
                {rejectedTeams.length > 0 ? (
                  rejectedTeams.map((team, idx) => (
                    <div key={idx} className="mypage-card">
                      <p><strong>{team.name}</strong> - 거절됨</p>
                    </div>
                  ))
                ) : <p>거절한 내역이 없습니다.</p>}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
