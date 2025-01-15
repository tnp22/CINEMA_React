import React from 'react'
import { Link } from 'react-router-dom'

const AdminHeader = () => {
  return (
    <div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
      <Link style={{ marginRight: '30px' }} to={`/`}>
        <img src="/upload/vora_purple_black.png" alt="Logo" style={{ width: '105px', height: '40px' }} />
      </Link>
      <h1>
        <Link to={`/admin`}>
          ADMINISTRATOR : <span className="adminTitle">AdminName</span>
        </Link>
      </h1>
    </div>
    <hr className="ms-0" style={{ width: '700px' }} />
  </div>
  )
}

export default AdminHeader