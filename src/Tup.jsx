import React, { useState } from 'react';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import AddIcon from '@mui/icons-material/Add';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CodeIcon from '@mui/icons-material/Code';
import GroupsIcon from '@mui/icons-material/Groups';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// SkillManager 컴포넌트
const SkillManager = ({ skills, setSkills }) => {
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  return (
    <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '12px', marginTop: '1.5rem' }}>
      <h3 style={{
        color: '#FF6B35',
        marginBottom: '1rem',
        fontFamily: "'Montserrat', 'Noto Sans KR', Arial, sans-serif",
        fontWeight: 700,
        letterSpacing: '0.02em'
      }}>
        <CodeIcon style={{ marginRight: '8px' }} />
        나의 기술 스택 관리
      </h3>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="새로운 기술 추가 (예: React, Python, AWS)"
          style={{
            flex: 1,
            padding: '0.8rem',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontFamily: "'Noto Sans KR', 'Montserrat', Arial, sans-serif"
          }}
        />
        <button 
          onClick={handleAddSkill} 
          style={{ 
            padding: '0.5rem 1rem',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          <AddIcon />
        </button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {skills.map((skill, index) => (
          <div key={index} style={{
            background: '#FFEBD6',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.95rem',
            fontFamily: "'Montserrat', 'Noto Sans KR', Arial, sans-serif"
          }}>
            {skill}
          </div>
        ))}
      </div>
    </div>
  );
};

// 가상 사용자 10명
const dummyUsers = [
  { id: 1, name: "홍길동", skills: ["React", "JavaScript"] },
  { id: 2, name: "김철수", skills: ["Python", "Django"] },
  { id: 3, name: "이영희", skills: ["Java", "Spring"] },
  { id: 4, name: "박민수", skills: ["C++", "알고리즘"] },
  { id: 5, name: "최지우", skills: ["UI/UX", "Figma"] },
  { id: 6, name: "정우성", skills: ["Node.js", "Express"] },
  { id: 7, name: "한지민", skills: ["DB", "SQL"] },
  { id: 8, name: "서준호", skills: ["React", "TypeScript"] },
  { id: 9, name: "오세훈", skills: ["AI", "TensorFlow"] },
  { id: 10, name: "임수정", skills: ["Flutter", "모바일"] },
];

// 드로어 메뉴 항목
const drawerMenus = [
  { key: "mypage", label: "마이페이지", sub: ["내 정보", "프로필 편집", "내 별점 확인하기⭐"] },
  { key: "activity", label: "활동 내역", sub: ["참가 공모전", "팀 프로젝트", "팀 채팅"] },
  { key: "settings", label: "설정", sub: ["알림 설정", "계정 관리"] },
];

function Tup() {
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

  // 드로어 메뉴 토글
  const handleMenuToggle = (key) => {
    setOpenMenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // 오버레이 클릭 시 메뉴 닫기
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('drawer-overlay')) {
      setDrawerOpen(false);
    }
  };

  const drawerWidth = 320;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      fontFamily: "'Noto Sans KR', 'Montserrat', Arial, sans-serif"
    }}>
      {/* 헤더 */}
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
        <div style={{
          color: '#555',
          fontSize: '1.05rem',
          fontFamily: "'Montserrat', 'Noto Sans KR', Arial, sans-serif",
          fontWeight: 300,
          letterSpacing: '0.03em'
        }}>
          
        </div>
        {/* 햄버거 메뉴 버튼 (메뉴 열릴 때는 숨김) */}
        {!drawerOpen && (
          <button
            onClick={() => setDrawerOpen(true)}
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

      {/* 오른쪽 드로어 메뉴 + 오버레이 */}
      <div>
        {drawerOpen && (
          <div
            className="drawer-overlay"
            onClick={handleOverlayClick}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.25)',
              zIndex: 2000,
              transition: 'background 0.3s'
            }}
          >
            <nav
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                width: `${drawerWidth}px`,
                height: '100vh',
                background: '#fff',
                boxShadow: '-2px 0 30px rgba(0,0,0,0.15)',
                zIndex: 2100,
                display: 'flex',
                flexDirection: 'column',
                padding: '2rem 1.5rem 1.5rem 1.5rem',
                transition: 'transform 0.3s',
                transform: drawerOpen ? 'translateX(0)' : `translateX(${drawerWidth}px)`
              }}
              aria-label="메뉴"
            >
              <button
                onClick={() => setDrawerOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  position: 'absolute',
                  right: '1.2rem',
                  top: '1.2rem',
                  cursor: 'pointer'
                }}
                aria-label="메뉴 닫기"
              >
                <CloseIcon style={{ fontSize: '2rem', color: '#FF6B35' }} />
              </button>
              <h2 style={{
                color: '#FF6B35',
                marginTop: '0.5rem',
                marginBottom: '2rem',
                textAlign: 'left',
                fontFamily: "'Montserrat', 'Noto Sans KR', Arial, sans-serif",
                fontWeight: 700,
                letterSpacing: '0.04em'
              }}>
                메뉴
              </h2>
              {drawerMenus.map(menu => (
                <div key={menu.key} style={{ marginBottom: '1.2rem' }}>
                  <button
                    onClick={() => handleMenuToggle(menu.key)}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: '#333',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.7rem 0.6rem',
                      borderRadius: '7px',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      backgroundColor: openMenus[menu.key] ? '#FFF7F1' : 'none',
                      fontFamily: "'Montserrat', 'Noto Sans KR', Arial, sans-serif"
                    }}
                    aria-expanded={openMenus[menu.key]}
                  >
                    {menu.label}
                    {openMenus[menu.key] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </button>
                  {openMenus[menu.key] && (
                    <ul style={{ listStyle: 'none', margin: 0, padding: '0 0 0 1.3rem', color: '#666' }}>
                      {menu.sub.map((item, idx) => (
                        <li key={idx} style={{
                          padding: '0.5rem 0',
                          borderBottom: idx < menu.sub.length - 1 ? '1px solid #f0e0d0' : 'none',
                          fontFamily: "'Noto Sans KR', 'Montserrat', Arial, sans-serif"
                        }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* 메인 콘텐츠 */}
      <div style={{
        maxWidth: '1200px',
        margin: '3rem auto',
        padding: '0 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          marginBottom: '1.5rem',
          color: '#222',
          maxWidth: '800px',
          fontFamily: "'Montserrat', 'Noto Sans KR', Arial, sans-serif",
          fontWeight: 800,
          letterSpacing: '0.01em'
        }}>
          함께할 <span style={{ color: '#FF6B35' }}>팀원</span>이 필요하신가요?
        </h2>
        <p style={{
          fontSize: '1.18rem',
          color: '#555',
          marginBottom: '3rem',
          maxWidth: '700px',
          lineHeight: '1.65',
          fontFamily: "'Noto Sans KR', 'Montserrat', Arial, sans-serif"
        }}>
          <span style={{ color: '#FF6B35' }}>TUP!</span>은 공모전 참가자들을 위한 지능형 팀 매칭 플랫폼입니다.<br />
          기술 스택과 관심사를 기반으로 최적의 팀원을 찾아보세요!
        </p>

        {/* 공모전 버튼 */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
          width: '100%',
          maxWidth: '800px'
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '16px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'transform 0.3s',
            fontFamily: "'Montserrat', 'Noto Sans KR', Arial, sans-serif"
          }}
            onClick={() => setModalOpen(true)}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <EmojiEventsIcon style={{ fontSize: '2.5rem', color: '#FF6B35', marginRight: '15px' }} />
              <h3 style={{
                fontSize: '1.5rem',
                margin: 0,
                fontFamily: "'Montserrat', 'Noto Sans KR', Arial, sans-serif",
                fontWeight: 700,
                letterSpacing: '0.01em'
              }}>공모전 참여하기</h3>
            </div>
            <div style={{
              background: '#f8f9fa',
              padding: '1.5rem',
              borderRadius: '12px',
              width: '100%',
              display: 'flex',
              gap: '1.5rem',
              alignItems: 'center',
              marginTop: '1rem'
            }}>
              <img
                src="/aws.png"
                alt="AWS"
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
              <div style={{ textAlign: 'left' }}>
                <h4 style={{
                  margin: '0 0 0.5rem 0',
                  color: '#333',
                  fontWeight: 700,
                  fontFamily: "'Montserrat', 'Noto Sans KR', Arial, sans-serif"
                }}>2025 AWS x Codetree 프로그래밍 경진대회</h4>
                <p style={{
                  margin: 0,
                  color: '#666',
                  fontSize: '0.98rem',
                  fontFamily: "'Noto Sans KR', 'Montserrat', Arial, sans-serif"
                }}>마감: 2025년 05월 16일 (D-14)</p>
              </div>
            </div>
          </div>

          {/* 플랫폼 특징 */}
          <div style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginTop: '1rem'
          }}>
            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              fontFamily: "'Montserrat', 'Noto Sans KR', Arial, sans-serif"
            }}>
              <GroupsIcon style={{ fontSize: '2.5rem', color: '#4CAF50', marginBottom: '1rem' }} />
              <h3 style={{
                margin: '0 0 0.5rem 0',
                fontWeight: 700,
                fontFamily: "'Montserrat', 'Noto Sans KR', Arial, sans-serif"
              }}>스킬 기반 매칭</h3>
              <p style={{
                margin: 0,
                color: '#666',
                fontFamily: "'Noto Sans KR', 'Montserrat', Arial, sans-serif"
              }}>기술 스택, 관심사, 경험을 기반으로 최적의 팀원을 찾습니다</p>
            </div>
            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              fontFamily: "'Montserrat', 'Noto Sans KR', Arial, sans-serif"
            }}>
              <CodeIcon style={{ fontSize: '2.5rem', color: '#2196F3', marginBottom: '1rem' }} />
              <h3 style={{
                margin: '0 0 0.5rem 0',
                fontWeight: 700,
                fontFamily: "'Montserrat', 'Noto Sans KR', Arial, sans-serif"
              }}>공모전 탐색</h3>
              <p style={{
                margin: 0,
                color: '#666',
                fontFamily: "'Noto Sans KR', 'Montserrat', Arial, sans-serif"
              }}>다양한 공모전 정보를 한눈에 확인하고 팀을 바로 구성하세요</p>
            </div>
          </div>
        </div>
      </div>

      {/* 모달 */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxWidth: 1200,
          bgcolor: 'background.paper',
          borderRadius: '12px',
          boxShadow: 24,
          p: 4,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            height: '100%'
          }}>
            {/* 좌측: 공모전 정보 */}
            <div>
              <img
                src="/aws.png"
                alt="공모전"
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}
              />
              <h2 style={{
                fontFamily: "'Montserrat', 'Noto Sans KR', Arial, sans-serif",
                fontWeight: 800,
                color: '#222',
                letterSpacing: '0.01em'
              }}>
                2025 AWS x Codetree 프로그래밍 경진대회
              </h2>
              <div style={{
                background: '#F8F9FA',
                padding: '1rem',
                borderRadius: '8px',
                marginTop: '1rem',
                fontFamily: "'Noto Sans KR', 'Montserrat', Arial, sans-serif"
              }}>
                <p>• 주최: AWS / 코드트리</p>
                <p>• 일정: 2025.04.21 ~ 2025.05.16</p>
                <p>• 마감: D-14</p>
                <p>• 분야: 프로그래밍, 클라우드</p>
              </div>
              <SkillManager skills={userSkills} setSkills={setUserSkills} />
            </div>
            {/* 우측: 팀 매칭 기능 */}
            <div>
              <h2 style={{
                color: '#FF6B35',
                fontFamily: "'Montserrat', 'Noto Sans KR', Arial, sans-serif",
                fontWeight: 800,
                letterSpacing: '0.01em'
              }}>
                <GroupsIcon style={{ marginRight: '8px' }} />
                함께하자 팀으로!
              </h2>
              <div style={{
                background: '#FFF5F2',
                borderRadius: '8px',
                padding: '1rem',
                marginTop: '1rem'
              }}>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  maxHeight: '200px',
                  overflowY: 'auto',
                  marginBottom: '1rem',
                  fontFamily: "'Noto Sans KR', 'Montserrat', Arial, sans-serif"
                }}>
                  {users.map(user => (
                    <li key={user.id} style={{
                      padding: '0.8rem',
                      margin: '0.5rem 0',
                      background: '#FFF9F7',
                      borderRadius: '6px'
                    }}>
                      {user.name} - {user.skills.join(', ')}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={matchTeam}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: '#FF6B35',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: "'Montserrat', 'Noto Sans KR', Arial, sans-serif",
                    fontWeight: 700
                  }}
                >
                  <GroupsIcon />
                  TEAM UP!
                </button>
                {matched.length > 0 && (
                  <div style={{ marginTop: '2rem' }}>
                    <h3 style={{
                      fontFamily: "'Montserrat', 'Noto Sans KR', Arial, sans-serif",
                      fontWeight: 700
                    }}>매칭 결과</h3>
                    {matched.map((team, idx) => (
                      <div key={idx} style={{
                        background: 'white',
                        borderRadius: '8px',
                        padding: '1rem',
                        marginBottom: '1rem'
                      }}>
                        <h4 style={{
                          fontFamily: "'Montserrat', 'Noto Sans KR', Arial, sans-serif",
                          fontWeight: 700
                        }}>팀 {idx + 1}</h4>
                        {team.map(user => (
                          <div key={user.id} style={{
                            padding: '0.5rem',
                            margin: '0.3rem 0',
                            background: '#FFF9F7',
                            borderRadius: '4px'
                          }}>
                            {user.name} - {user.skills.join(', ')}
                          </div>
                        ))}
                        <div style={{
                          display: 'flex',
                          gap: '0.5rem',
                          marginTop: '1rem',
                          alignItems: 'center'
                        }}>
                          <span>피드백:</span>
                          <button
                            onClick={() => handleFeedback(idx, true)}
                            style={{
                              background: feedbacks[idx] === true ? '#FF6B35' : '#eee',
                              border: 'none',
                              padding: '0.5rem 1rem',
                              borderRadius: '20px',
                              cursor: 'pointer',
                              color: feedbacks[idx] === true ? 'white' : '#333'
                            }}
                          >
                            <ThumbUpIcon />
                          </button>
                          <button
                            onClick={() => handleFeedback(idx, false)}
                            style={{
                              background: feedbacks[idx] === false ? '#FF6B35' : '#eee',
                              border: 'none',
                              padding: '0.5rem 1rem',
                              borderRadius: '20px',
                              cursor: 'pointer',
                              color: feedbacks[idx] === false ? 'white' : '#333'
                            }}
                          >
                            <ThumbDownIcon />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default Tup;