// src/utils/dateUtils.js

export function calculateDday(deadline) {
  const today = new Date();
  const dueDate = new Date(deadline + 'T00:00:00'); // 날짜 안정성 보정

  // 오늘 날짜를 00시 00분으로 초기화
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 0) return `D-${diffDays}`;
  else if (diffDays < 0) return `D+${Math.abs(diffDays)}`;
  else return 'D-DAY';
}
