import React from 'react';

const allSkills = [
  "리더십", "기획력", "소통", "협업", "꼼꼼함",
  "책임감", "친절함", "창의력", "분석력", "논리력",
  "실행력", "시간관리", "문제해결", "열정", "끈기",
  "적응력", "발표력", "공감력", "전략적 사고", "자기주도성"
];

const SkillManager = ({ skills, setSkills, mainRole, setMainRole, subRole, setSubRole, disabled = false }) => {
  const toggleSkill = (skill) => {
    if (disabled) return; // 🔒 버튼 클릭 막기

    if (skills.includes(skill)) {
      setSkills(skills.filter(s => s !== skill));
    } else {
      if (skills.length >= 3) {
        alert("역량 키워드는 최대 3개까지 선택할 수 있어요!");
        return;
      }
      setSkills([...skills, skill]);
    }
  };

  return (
    <div
      style={{
        marginTop: '1rem',
        padding: '0 1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <h4 style={{
        fontFamily: "'Montserrat', 'Noto Sans KR'",
        fontWeight: 600,
        marginBottom: '0.5rem'
      }}>
        나의 역량 키워드 (최대 3개 선택)
      </h4>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        width: '100%'
      }}>
        {allSkills.map(skill => (
          <button
            key={skill}
            onClick={() => toggleSkill(skill)}
            disabled={disabled} // 🔒 버튼 비활성화
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: '1px solid #ccc',
              backgroundColor: skills.includes(skill) ? '#FF6B35' : '#F0F0F0',
              color: skills.includes(skill) ? 'white' : '#333',
              cursor: disabled ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.2s',
              opacity: disabled ? 0.6 : 1,
              fontFamily: "'Noto Sans KR', 'Montserrat'"
            }}
          >
            {skill}
          </button>
        ))}
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
        width: '100%'
      }}>
        <div>
          <label style={{ fontWeight: 600 }}>희망 역할군</label>
          <input
            type="text"
            placeholder="예: 프로젝트 매니저, 발표 담당"
            value={mainRole}
            onChange={(e) => setMainRole(e.target.value)}
            disabled={disabled} // 🔒 입력창 비활성화
            style={{
              width: '100%',
              padding: '0.7rem',
              marginTop: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '6px',
              fontSize: '0.95rem',
              boxSizing: 'border-box',
              backgroundColor: disabled ? '#f5f5f5' : 'white'
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 600 }}>보조 가능 역할군</label>
          <input
            type="text"
            placeholder="예: 디자인 에디터, 조사 담당"
            value={subRole}
            onChange={(e) => setSubRole(e.target.value)}
            disabled={disabled} // 🔒 입력창 비활성화
            style={{
              width: '100%',
              padding: '0.7rem',
              marginTop: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '6px',
              fontSize: '0.95rem',
              boxSizing: 'border-box',
              backgroundColor: disabled ? '#f5f5f5' : 'white'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SkillManager;
