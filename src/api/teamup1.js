import http from "../lib/http";

// 1) 사용자 입력 저장 (대기열 등록용 데이터 저장)
export const saveUserInput = async (payload) => {
  // payload: { userId, skills, mainRole, subRole, keywords, hasReward? }
  const { data } = await http.post("/teamup/save_user_input", payload);
  return data; // { message }
};

// 2) 팀 매칭 시도 (대기열 인원 <4면 200 + message)
export const applyTeamup = async (userId) => {
  const { data } = await http.post("/teamup/apply_teamup", { userId });
  return data; // { message, teamId? }
};

// 3) 매칭된 팀 목록 조회
export const getMatchedTeams = async () => {
  const { data } = await http.get("/teamup/get_matched_teams");
  return data; // [ { teamId, members:[userId,...], status } ]
};

// 4) 피드백 저장
export const submitFeedback = async ({ teamId, userId, agree }) => {
  const { data } = await http.post("/teamup/submit_feedback", { teamId, userId, agree });
  return data; // { message }
};

// 5) 재매칭 / 대기열 이동 액션
export const performFeedbackAction = async ({ teamId, userId, action }) => {
  const { data } = await http.post("/teamup/submit_feedback", {
    teamId,
    userId,
    action, // 'rematch' 또는 'requeue'
  });
  return data; // { message }
};