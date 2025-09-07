import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DrawerMenu from '../components/DrawerMenu';
import ContestModal from '../components/ContestModal';
import { useNavigate } from 'react-router-dom';
import { calculateDday } from '../utils/dateUtils';
import './Home.css';
import dummyUsers from '../data/dummyUsers.json';

const modifiedcontestList = [
  {
    id: 1,
    title: "2025 AWS x Codetree 프로그래밍 경진대회",
    deadline: "2025-05-16",
    image: "/aws2.png"
  },
  {
    id: 2,
    title: "제7회 서울교육 데이터 분석·활용 아이디어 공모전",
    deadline: "2025-06-01",
    image: "/seoul2.png"
  },
  {
    id: 3,
    title: "2025년 경기도서관 크리에이티브 시너지 공모전",
    deadline: "2025-06-30",
    image: "/creative2.png"
  },
  {
    id: 4,
    title: "2025 GH 공간복지 청년 공모전",
    deadline: "2025-06-29",
    image: "/gh2.png"
  },
  {
    id: 5,
    title: "제6회 뉴스읽기 뉴스일기 공모전",
    deadline: "2025-07-31",
    image: "/news2.png"
  }
];

function Home() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [userSkills, setUserSkills] = useState(["React", "JavaScript"]);
  const [users] = useState(dummyUsers);
  const [matched, setMatched] = useState([]);
  const [feedbacks, setFeedbacks] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({});

  const matchTeam = () => {
    const shuffled = [...users].sort(() => Math.random() - 0.5);
    setMatched([shuffled.slice(0, 5), shuffled.slice(5, 10)]);
  };

  const handleFeedback = (teamIndex, isPositive) => {
    setFeedbacks(prev => ({ ...prev, [teamIndex]: isPositive }));
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <span className="home-logo">TUP!</span>
        {!drawerOpen && (
          <button
            onClick={() => setDrawerOpen(true)}
            className="menu-button"
            aria-label="메뉴 열기"
          >
            <MenuIcon style={{ fontSize: '2.2rem', color: '#FF6B35' }} />
          </button>
        )}
      </header>

      <DrawerMenu
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        openMenus={openMenus}
        onToggle={setOpenMenus}
      />

      <section
        className="hero-banner"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/team.png)`
        }}
      >
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>
              <span className="brand">TUP!</span><br />
              함께할 <span className="highlight">팀원</span>이 필요하신가요?
            </h1>
            <p>
              <span className="brand">TUP!</span>은 공모전 참가자를 위한 지능형 팀 매칭 플랫폼입니다.<br />
              기술 스택과 관심사를 기반으로 최적의 팀원을 찾아보세요!
            </p>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="scroll-indicator">▼</div>
        <div className="feature-card" onClick={() => navigate('/TeamMatching1')}>
          <h2>AutoTeamUp</h2>
          <p>공모전을 먼저 선택한 뒤, 빠르게 랜덤으로 팀을 구성할 수 있어요</p>
          <button>빠르게 팀 결성하기!</button>
        </div>
        <div className="feature-card" onClick={() => navigate('/TeamMatching2')}>
          <h2>OpenTeamUp</h2>
          <p>원하는 공모전, 팀장 또는 팀원이 되어 자유롭게 참여해보세요</p>
          <button>자유롭게 팀 결성하기!</button>
        </div>
      </section>

      {/* ✅ 수정된 공모전 카드 섹션 */}
      <section className="contest-list-section">
        <h2><EmojiEventsIcon style={{ color: '#FF6B35', marginRight: '0.5rem' }} />공모전 참여하기</h2>
        <div className="contest-list-scroll">
          {modifiedcontestList.map(contest => (
            <div key={contest.id} className="contest-card">
              <img src={contest.image} alt="공모전 이미지" className="contest-img" />
              <div className="contest-text">
                <h4>{contest.title}</h4>
                <p>마감: {contest.deadline} ({calculateDday(contest.deadline)})</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ContestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        users={users}
        userSkills={userSkills}
        setUserSkills={setUserSkills}
        matched={matched}
        matchTeam={matchTeam}
        feedbacks={feedbacks}
        onFeedback={handleFeedback}
      />
    </div>
  );
}

export default Home;
