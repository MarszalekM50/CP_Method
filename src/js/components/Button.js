import React from 'react';
//Exit button (można ewentualnie edytować, ale to jest obejście problemu z css w nowym oknie)
const MyButton = ({ children, onClick }) => {
    return (
      <button 
        style={{
          padding: '15px 30px',
          fontSize: '1.5em',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          transition: 'background-color 0.3s, transform 0.2s',
          margin: '15px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          width: '350px'
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = '#c82333';
          e.target.style.transform = 'translateY(-3px)';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = '#dc3545';
          e.target.style.transform = 'translateY(0)';
        }}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };
  

export default MyButton;
