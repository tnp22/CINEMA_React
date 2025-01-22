import React from 'react';
import { Link } from 'react-router-dom';

const F404 = () => {
  return (
    <div style={{ width: '100%', height: '98vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <style>
        {`
        body{
            background-color: #583BBF;
        }
        a{
            
            text-decoration: none;
            color: #583BBF;
        }
        .haman{
            display: flex; flex-direction: column;justify-content: center; align-items: center;
            background-color: white; width: 95%; height: 95%; border-radius: 10%;
        }
        .haman h1{
            font-size: 100px;
        }
        .haman h3{
            font-size: 40px;
        }
        `}
    </style>
      <div className="haman">
      <img src="/upload/vora_purple_black.png" alt="Logo"  style={{ width: '380px' }} />
        <br />
        <h1>403</h1>
        <h3>😢접근 권한이 없습니다.</h3>
        <br /><br /><br /><br /><br />
        <div className="btn-primary">
          <Link to="/">메인 페이지</Link>
        </div>
      </div>
    </div>
  );
};

export default F404;
