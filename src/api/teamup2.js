// src/api/teamup2.js
import axios from 'axios';

// 팀 생성
export const createTeam = async (teamData) => {
  const res = await axios.post('/api/teams', teamData);
  return res.data;
};

// 팀 리스트 조회
export const getTeamList = async () => {
  const res = await axios.get('/api/openteamup/teams');
  return res.data;
};

// 지원자 수락
export const acceptApplicant = async (teamId, userId) => {
  const res = await axios.post(`/api/openteamup/teams/${teamId}/accept`, { userId });
  return res.data;
};

// 팀에 지원
export const applyToTeam = async (teamId, userId) => {
  const res = await axios.post(`/api/openteamup/teams/${teamId}/apply`, {
    applicant: userId,
  });
  return res.data;
};

// 초대 보내기
export const sendInvite = async (teamId, userId, inviterId) => {
  const res = await axios.post(`/api/invites`, {
    teamId,
    userId,
    invitedBy: inviterId,
  });
  return res.data;
};

// 초대 수락 / 거절
export const respondToInvite = async (teamId, userId, accepted) => {
  const action = accepted ? 'accept' : 'reject';
  const res = await axios.post(`/api/invites/${teamId}/${action}`, {
    userId,
  });
  return res.data;
};

// 지원자 목록 불러오기
export const getApplicants = async () => {
  const res = await axios.get(`/api/openteamup/applicants`);
  return res.data;
};
