// src/components/CalendarReader.jsx
import React, { useEffect } from 'react';
import { gapi } from 'gapi-script';

const CLIENT_ID = '306835966226-t1gmfcm5eojramt3l1g5odesf6ibji7u.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDujVtdNGAX22AcB1DeEAlw-tY90e0OOvM';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

function CalendarReader() {
  useEffect(() => {
    const initClient = () => {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: [DISCOVERY_DOC],
          scope: SCOPES,
        })
        .then(() => {
          // 이미 로그인된 사용자의 accessToken을 사용 (로그인 안쓰면 따로 구현 필요)
          gapi.client.calendar.events
            .list({
              calendarId: 'primary',
              timeMin: new Date().toISOString(),
              showDeleted: false,
              singleEvents: true,
              maxResults: 10,
              orderBy: 'startTime',
            })
            .then(response => {
              console.log('캘린더 이벤트 목록:', response.result.items);
            });
        });
    };

    gapi.load('client', initClient);
  }, []);

  return <div>Google 캘린더에서 일정 불러오는 중...</div>;
}

export default CalendarReader;
