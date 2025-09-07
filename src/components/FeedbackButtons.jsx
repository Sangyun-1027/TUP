import React from 'react';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

const FeedbackButtons = ({ teamIndex, feedbacks, onFeedback }) => {
  return (
    <div style={{
      display: 'flex',
      gap: '0.75rem',
      marginTop: '1rem',
      alignItems: 'center',
      paddingLeft: '1.5rem'
    }}>
      <span style={{ fontWeight: 500 }}>피드백:</span>

      <button
        onClick={() => onFeedback(teamIndex, true)}
        style={{
          background: feedbacks[teamIndex] === true ? '#FF6B35' : '#fff',
          border: '1.5px solid #ccc',
          padding: '0.6rem 1.2rem',
          borderRadius: '12px',
          cursor: 'pointer',
          color: feedbacks[teamIndex] === true ? 'white' : '#333',
          fontSize: '1.2rem',
          transition: 'all 0.2s ease',
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = feedbacks[teamIndex] === true ? '#FF6B35' : '#f2f2f2'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = feedbacks[teamIndex] === true ? '#FF6B35' : '#fff'}
      >
        <ThumbUpIcon fontSize="inherit" />
      </button>

      <button
        onClick={() => onFeedback(teamIndex, false)}
        style={{
          background: feedbacks[teamIndex] === false ? '#FF6B35' : '#fff',
          border: '1.5px solid #ccc',
          padding: '0.6rem 1.2rem',
          borderRadius: '12px',
          cursor: 'pointer',
          color: feedbacks[teamIndex] === false ? 'white' : '#333',
          fontSize: '1.2rem',
          transition: 'all 0.2s ease',
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = feedbacks[teamIndex] === false ? '#FF6B35' : '#f2f2f2'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = feedbacks[teamIndex] === false ? '#FF6B35' : '#fff'}
      >
        <ThumbDownIcon fontSize="inherit" />
      </button>
    </div>
  );
};

export default FeedbackButtons;
