import React, { useState, useEffect, useRef } from 'react';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import SkillManager from './SkillManager';
import TeamList from './TeamList';
import FeedbackModal from './FeedbackModal';
import { calculateDday } from '../utils/dateUtils';
import GroupsIcon from '@mui/icons-material/Groups';
import { toast } from 'react-toastify';
import { saveUserInput, applyTeamup, getMatchedTeams } from "../api/teamup1"; // API 래퍼

const ContestModal = ({
  open,
  onClose,
  selectedContest,
  users,
  setUsers,
  userSkills,
  setUserSkills,
  feedbacks,
  onFeedback,
  currentUser
}) => {
  const [mainRole, setMainRole] = useState('');
  const [subRole, setSubRole] = useState('');
  const [matched, setMatched] = useState([]);
  const [rawTeams, setMRawTeams] = useState([]);  // ✅ 팀 목록 상태 정의
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const hasShownToast = useRef(false);
  const formRef = useRef(null);
  const queueRef = useRef(null); 
  const [isHovered, setIsHovered] = useState(false);
  const [isTeamHovered, setIsTeamHovered] = useState(false);
  const [isFeedbackHovered, setIsFeedbackHovered] = useState(false);
  const [isTeamroomHovered, setIsTeamroomHovered] = useState(false);

  const scrollToBoth = () => {
  formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  queueRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
  useEffect(() => {
    const alreadySaved = users.some(u => u.id === currentUser?.id);
    if (open && !hasShownToast.current && !alreadySaved) {
    toast.info("공모전 입력란(역량 키워드, 역할군 등)을 먼저 작성해주세요!");
    hasShownToast.current = true;
    }
  }, [open, users, currentUser]);

// ✅ 모달이 열리면 서버에서 현재 팀 상태를 로드해서 matched에 주입
  useEffect(() => {
    if (!open || !selectedContest?.id) return;
  (async () => {
      try {
         const list = await getMatchedTeams();
      if (Array.isArray(list)) {
        setRawTeams(list);
        // TeamList가 멤버 객체를 기대하면 users에서 아이디 기준으로 수화(hydrate)
        const hydrate = (ids) =>
          ids.map(uid => users.find(u => u.id === uid) || { id: uid, name: `User ${uid}` });
        setMatched(list.map(t => hydrate(t.members)));
      }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [open, selectedContest?.id]);

    const isMatched = matched.some(team =>
    team.some(member => member.id === currentUser?.id)
  );

// // ✅ 재매칭 함수
//   const handleRematch = async () => {
//   const myTeam = matched.find(team =>
//     team.some(member => member.id === currentUser?.id)
//   );
//   if (!myTeam) return;

//   const agreedUsers = myTeam.filter(member =>
//     feedbacks[member.id] === '👍'
//   );

//   if (agreedUsers.length < 2) {
//     toast.warning("동의한 인원이 너무 적어요! 재매칭이 어려워요.");
//     return;
// // ✅ rawTeams에서 내 팀의 teamId 찾기  /  🦀 이 하단 코드부분은 장고 수정본 보면서 재매칭 api 구조 파악한 후에 수정해야할듯
//     const rawMyTeam = rawTeams.find(t =>
//       (t.members || []).some(m => m.id === currentUser?.id)
//     );
//     const teamId = rawMyTeam?.id;
//   }
// // ✅ 백엔드 재매칭 API 호출
//   if (!selectedContest?.id) {
//     toast.error("공모전 정보가 없습니다.");
//     return;
//   }
//   try {
//     const res = await runRematch({
//       contestId: selectedContest.id,
//       agreedUserIds: agreedUsers.map(u => u.id),
//       teamId,
//     });
//     if (res?.success && Array.isArray(res.teams)) {
//       // TeamList가 기대하는 구조(배열의 배열)로 변환
//       setMatched(res.teams.map(t => t.members || []));
//       toast.success("재매칭 완료!");
//       // const refetch = await fetchTeams(selectedContest.id);
//       // setRawTeams(refetch.teams || []);
//     } else {
//       toast.info("재매칭을 수행하지 못했어요.");
//     }
//   } catch (e) {
//     console.error(e);
//     toast.error(e.message || "재매칭 중 오류가 발생했습니다.");
//   }
// };


// // ✅ 비동의 인원 대기열로 이동
// const handleRequeue = () => {
//   const myTeam = matched.find(team =>
//     team.some(member => member.id === currentUser?.id)
//   );
//   if (!myTeam) return;

//   const disagreedUsers = myTeam.filter(member =>
//     feedbacks[member.id] === '👎'
//   );

//   if (disagreedUsers.length === 0) {
//     toast.info("비동의자가 없습니다.");
//     return;
//   }

//   // ⛔ 프론트에서 직접 대기열 복귀 로직 제거
//   /*
//   setUsers(prev => [
//     ...prev.filter(u => !disagreedUsers.some(d => d.id === u.id)),
//     ...disagreedUsers
//   ]);

//   setMatched(prev =>
//     prev.filter(team => team !== myTeam)
//   );
//   */

//   toast.info("비동의자가 대기열로 이동할 예정입니다."); // 추후 API 연동 후 적용
// };


  const handleSave = async () => {
  if (isMatched) {
    toast.warning("이미 팀에 속해 있어 수정할 수 없습니다.");
    return;
  }

  if (userSkills.length === 0 || !mainRole.trim()) {
    toast.warning("역량 키워드와 희망 역할군을 모두 입력해주세요.");
    return;
  }

  if (!currentUser || !currentUser.id) {
    toast.error("현재 사용자 정보가 없습니다.");
    return;
  }

  const newUser = {
    id: currentUser.id,
    name: currentUser.name || "나",
    skills: userSkills,
    keywords: userSkills,
    mainRole,
    subRole,
    rating: currentUser.rating ?? null,
    participation: currentUser.participation ?? 0
  };

  const alreadyInQueue = users.some(user => user.id === currentUser.id);
  // ✅ 사용자 입력 저장 (대기열 정보 저장)
  try {
      const res = await saveUserInput({
      userId: newUser.id,
      skills: newUser.skills,
      mainRole: newUser.mainRole,
      subRole: newUser.subRole || undefined,
      keywords: newUser.keywords || newUser.skills,
      hasReward: false, // 필요 시 UI에서 선택값 연결
      });
      
      if (res?.message) {
      // ⭕️ UI 유지 위해 로컬 큐도 업데이트(백엔드 연동 전 단계에서 임시)
      if (alreadyInQueue) {
        setUsers(prev => prev.map(u => (u.id === newUser.id ? newUser : u)));
        toast.info("기존 정보를 수정했어요.");
      } else {
        setUsers(prev => [...prev, newUser]);
        toast.success("저장 완료! 대기열에 추가되었습니다.");
      }
    } else {
      toast.error("등록에 실패했습니다.");
    }
  } catch (e) {
    console.error(e);
    toast.error(e.message || "네트워크 오류");
  }
};

 const matchTeam = async () => {
  // 기존 로컬 대기열 체크는 유지
  if (users.length < 4) {
    toast.info("대기 인원이 부족해요! 팀업을 기다려주세요 😊");
    return;
  }
  if (!currentUser?.id) {
     toast.error("현재 사용자 정보가 없습니다.");
     return;
   }
   try {
     const res = await applyTeamup(currentUser.id);
     // 백엔드 스펙: 200이면 메시지, 201이면 생성 + teamId
     if (res?.teamId) {
       toast.success(`팀 매칭 완료! (teamId: ${res.teamId})`);
     } else if (res?.message) {
       toast.info(res.message); // "인원이 부족합니다. 대기열에서 대기 중입니다." 등
     }
     // 매칭/상태 반영을 위해 목록 재조회
     const list = await getMatchedTeams();
     if (Array.isArray(list)) {
       setRawTeams(list);
       const hydrate = (ids) =>
         ids.map(uid => users.find(u => u.id === uid) || { id: uid, name: `User ${uid}` });
       setMatched(list.map(t => hydrate(t.members)));
     }
   } catch (e) {
     console.error(e);
     toast.error(e.message || "매칭 중 오류가 발생했습니다.");
   }
  };



  if (!selectedContest) return null;

  const {
    title,
    image,
    category,
    deadline,
    start,
    organizer
  } = selectedContest;

  const myTeam = matched.find(team =>
    team.some(member => member.id === currentUser?.id)
  );

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <div style={{
          width: '100vw',
          height: '100vh',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
            <button onClick={onClose} style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}>
              <CloseIcon />
            </button>
          </div>

          <div style={{
            display: 'flex',
            flex: 1,
            overflow: 'hidden',
            padding: '0 2rem 2rem 2rem',
            gap: '2rem'
          }}>
            <div style={{ width: '40%', overflowY: 'auto' }}>
              <img
                src={image}
                alt="공모전"
                style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }}
              />
              <h2 style={{ fontFamily: "'Montserrat', 'Noto Sans KR'", fontWeight: 800 }}>{title}</h2>
              <div style={{
                background: '#F8F9FA',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <p>• 주최: {organizer}</p>
                <p>• 일정: {start} ~ {deadline}</p>
                <p>• 마감: {calculateDday(deadline)}</p>
                <p>• 분야: {category}</p>
              </div>

              <div ref={formRef} style={{ marginTop: '1rem' }}>
                <SkillManager
                  skills={userSkills}
                  setSkills={setUserSkills}
                  mainRole={mainRole}
                  setMainRole={setMainRole}
                  subRole={subRole}
                  setSubRole={setSubRole}
                  disabled={isMatched}
                />
                {isMatched && (
                  <p style={{ color: '#999', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    ⚠ 팀에 속한 상태에서는 입력을 수정할 수 없습니다.
                  </p>
                )}
              <button
                  onClick={handleSave}
                  disabled={isMatched}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    backgroundColor: isMatched
                      ? '#ccc'
                      : isHovered
                      ? '#ff824e' // hover 시 밝은 오렌지
                      : '#FF6B35',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    marginTop: '1.5rem',
                    fontFamily: "'Montserrat', 'Noto Sans KR'",
                    cursor: isMatched ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: isMatched ? 'none' : '0 2px 6px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.2s ease-in-out',
                    transform: isHovered && !isMatched ? 'translateY(-1px)' : 'translateY(0)',
                  }}
                >
                  Save!
                </button>

              </div>
            </div>

            <div style={{ width: '60%', overflowY: 'auto' }}>
              <h2 style={{
                color: '#FF6B35',
                fontFamily: "'Montserrat', 'Noto Sans KR'",
                fontWeight: 800
              }}>
                <GroupsIcon style={{ marginRight: '0.5rem' }} />
                함께하자 팀으로!
              </h2>

         
              <div ref={queueRef} style={{
                listStyle: 'none',
                padding: 0,
                maxHeight: '200px',
                overflowY: 'auto',
                marginBottom: '1rem',
                background: '#FFF9F7',
                borderRadius: '8px',
                paddingInline: '1rem'
              }}>
                {users.map(user => (
                  <li key={user.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.8rem 0',
                    borderBottom: '1px solid #eee',
                    fontWeight: 500,
                    fontSize: '1rem',
                    color: '#333'
                  }}>
                    
                  👤  {user.name}
                  </li>
                ))}
                </div>
                          {/* 팀업 버튼 또는 안내 메시지 */}
              {myTeam ? (
                <p style={{
                  maxWidth: '100%',    
                  width: '100%',
                  padding: '1rem',
                  background: '#FFF3ED',
                  color: '#FF6B35',
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: '1rem',
                  border: '1px solid #FF6B35',
                  boxSizing: 'border-box'       // ✅ 패딩 포함해서 너비 계산
                }}>
                  이미 팀에 속해 있어요! 결과를 기다려주세요 😊
                </p>
              ) : (
             <button
              onClick={matchTeam}
              onMouseEnter={() => setIsTeamHovered(true)}
              onMouseLeave={() => setIsTeamHovered(false)}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: isTeamHovered ? '#ff824e' : '#FF6B35', // hover 시 밝은 주황
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: 700,
                marginBottom: '1rem',
                fontFamily: "'Montserrat', 'Noto Sans KR'",
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.2s ease-in-out',
                transform: isTeamHovered ? 'translateY(-1px)' : 'translateY(0)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <GroupsIcon style={{ marginRight: '0.5rem' }} />
              TEAM UP!
            </button>
              )}
       
              {matched.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <TeamList
                    matched={matched}
                    feedbacks={feedbacks}
                    onFeedback={onFeedback}
                    currentUser={currentUser}
                  />
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    marginTop: '1.5rem',
                    paddingBottom: '1rem'
                  }}>
                    <button
                    onMouseEnter={() => setIsFeedbackHovered(true)}
                    onMouseLeave={() => setIsFeedbackHovered(false)}
                    onClick={() => setIsFeedbackModalOpen(true)}
                    style={{
                      flex: 1,
                      padding: '0.9rem', // 기존 크기 유지
                      backgroundColor: isFeedbackHovered ? '#ff824e' : '#FF6B35',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: 600,
                      fontFamily: "'Montserrat', 'Noto Sans KR'",
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      transition: 'background-color 0.2s ease, transform 0.2s ease',
                      transform: isFeedbackHovered ? 'translateY(-1px)' : 'translateY(0)',
                    }}
                  >
                    피드백 결과 확인하기
                  </button>
                   <button
                      onMouseEnter={() => setIsTeamroomHovered(true)}
                      onMouseLeave={() => setIsTeamroomHovered(false)}
                      onClick={() => window.open('/TeamPage', '_blank')}
                      style={{
                        flex: 1,
                        padding: '0.9rem', // 기존 세로 크기 유지
                        backgroundColor: isTeamroomHovered ? '#ff824e' : '#FF6B35',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        fontFamily: "'Montserrat', 'Noto Sans KR'",
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        transition: 'background-color 0.2s ease, transform 0.2s ease',
                        transform: isTeamroomHovered ? 'translateY(-1px)' : 'translateY(0)',
                      }}
                    >
                      팀룸으로 이동하기
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>

      <FeedbackModal
        open={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        team={myTeam || []}
        feedbacks={feedbacks}
        currentUser={currentUser}
        scrollToBoth={scrollToBoth}
        teamId={myTeam?.id}       // ✅ 새로 추가
        // onRematch={handleRematch}       // ✅ 추가
        // onRequeue={handleRequeue}       // ✅ 추가
        users={users}
      />
    </>
  );
};

export default ContestModal;
