import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PrivateRoute = ({ element, requiredRole, ...rest }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("userInfo");

    // 권한이 없으면 에러 페이지로 리디렉션
    if (!userRole) {
      navigate('/admin/error');
      return;
    }

    try {
      const parsedRole = JSON.parse(userRole);
      const hasRequiredRole = parsedRole.authList.some(role => role.auth === requiredRole);

      if (!hasRequiredRole) {
        navigate('/admin/error');
      }
    } catch (error) {
      navigate('/admin/error');
    }
  }, [navigate, requiredRole]);

  return element;
};

export default PrivateRoute;
