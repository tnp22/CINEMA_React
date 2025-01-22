import React, { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import AddMap from '../components/Admin/AddMap/AddMap'
import AdminMainForm from '../components/Admin/AdminMainForm'
import F404 from '../components/Admin/F404'

import BannerInsert from '../components/Admin/Banner/BannerInsert'
import BannerList from '../components/Admin/Banner/BannerList'
import BannerSelect from '../components/Admin/Banner/BannerSelect'
import BannerUpdate from '../components/Admin/Banner/BannerUpdate'

import CastInsert from '../components/Admin/Cast/CastInsert'
import CastList from '../components/Admin/Cast/CastList'
import CastSelect from '../components/Admin/Cast/CastSelect'
import CastUpdate from '../components/Admin/Cast/CastUpdate'

import CinemaInsert from '../components/Admin/Cinema/CinemaInsert'
import CinemaSelect from '../components/Admin/Cinema/CinemaSelect'
import CinemaUpdate from '../components/Admin/Cinema/CinemaUpdate'
import CinemaUpdateList from '../components/Admin/Cinema/CinemaUpdateList'

import MovieInsert from '../components/Admin/Movie/MovieInsert'
import MovieList from '../components/Admin/Movie/MovieList'
import MovieSelect from '../components/Admin/Movie/MovieSelect'
import MovieUpdate from '../components/Admin/Movie/MovieUpdate'

import NoticeInsert from '../components/Admin/Notice/NoticeInsert'
import NoticeList from '../components/Admin/Notice/NoticeList'
import NoticeSelect from '../components/Admin/Notice/NoticeSelect'
import NoticeUpdate from '../components/Admin/Notice/NoticeUpdate'

import ReviewManagerList from '../components/Admin/ReviewManager/ReviewManagerList'

import TheaterInsert from '../components/Admin/Theater/TheaterInsert'
import TheaterList from '../components/Admin/Theater/TheaterList'
import TheaterSelect from '../components/Admin/Theater/TheaterSelect'
import TheaterUpdate from '../components/Admin/Theater/TheaterUpdate'

import TheaterListInsert from '../components/Admin/TheaterList/TheaterListInsert'
import TheaterListList from '../components/Admin/TheaterList/TheaterListList'
import TheaterListSelect from '../components/Admin/TheaterList/TheaterListSelect'
import TheaterListUpdate from '../components/Admin/TheaterList/TheaterListUpdate'

import AuthInsert from '../components/Admin/UserManager/auth/AuthInsert'
import AuthList from '../components/Admin/UserManager/Auth/AuthList'

import UserList from '../components/Admin/UserManager/User/UserList'
import UserSelect from '../components/Admin/UserManager/User/UserSelect'
import UserUpdate from '../components/Admin/UserManager/User/UserUpdate'


import PrivateRoute from '../components/Admin/PrivateRoute';  // PrivateRoute 컴포넌트 임포트

const admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 사용자 권한 가져오기 (예시: localStorage나 context에서)
    const userRole = localStorage.getItem("roles")


    // roles 값이 존재하지 않거나 파싱이 실패하면 기본값 설정
    if (!userRole) {
      navigate('/admin/error');
      return;
    }

    try {
      // roles 값을 JSON 객체로 파싱
      const parsedRole = JSON.parse(userRole);

      // isAdmin 권한 체크
      if (!parsedRole.isAdmin) {
        // 권한이 없으면 메인 페이지로 리디렉션
        navigate('/admin/error');
      }
    } catch (error) {
      // JSON 파싱 실패 시 메인 페이지로 리디렉션
      navigate('/admin/error');
    }
  }, [navigate]);

  

  return (
      <Routes>
          <Route path="/" element={<AdminMainForm/>}></Route>
          <Route path="/error" element={<F404/>}></Route>

          <Route
          path="/addmap/addmap"
          element={<PrivateRoute element={<AddMap />} requiredRole="ROLE_SUPER" />}
          />

          <Route path="/banner/list" element={<PrivateRoute element={<BannerList />} requiredRole="ROLE_SUPER" />}></Route>
          <Route path="/banner/insert" element={<PrivateRoute element={<BannerInsert />} requiredRole="ROLE_SUPER" />}></Route>
          <Route path="/banner/select/:id" element={<PrivateRoute element={<BannerSelect />} requiredRole="ROLE_SUPER" />}></Route>
          <Route path="/banner/update/:id" element={<PrivateRoute element={<BannerUpdate />} requiredRole="ROLE_SUPER" />}></Route>
          
          
          <Route path="/cast/list"element={<PrivateRoute element={<CastList />} requiredRole="ROLE_SUPER" />}></Route>
          <Route path="/cast/insert" element={<PrivateRoute element={<CastInsert />} requiredRole="ROLE_SUPER" />}></Route>
          <Route path="/cast/select/:id" element={<PrivateRoute element={<CastSelect />} requiredRole="ROLE_SUPER" />}></Route>
          <Route path="/cast/update/:id" element={<PrivateRoute element={<CastUpdate />} requiredRole="ROLE_SUPER" />}></Route>

          <Route path="/cinema/updateList" element={<PrivateRoute element={<CinemaUpdateList />} requiredRole="ROLE_SUPER" />}></Route>
          <Route path="/cinema/insert" element={<PrivateRoute element={<CinemaInsert />} requiredRole="ROLE_SUPER" />}></Route>
          <Route path="/cinema/select/:id" element={<PrivateRoute element={<CinemaSelect />} requiredRole="ROLE_SUPER" />}></Route>
          <Route path="/cinema/update/:id" element={<PrivateRoute element={<CinemaUpdate />} requiredRole="ROLE_SUPER" />}></Route>

          <Route path="/movie/list" element={<PrivateRoute element={<MovieList />} requiredRole="ROLE_SUPER" />}></Route>
          <Route path="/movie/insert" element={<PrivateRoute element={<MovieInsert />} requiredRole="ROLE_SUPER" />}></Route>
          <Route path="/movie/select/:id" element={<PrivateRoute element={<MovieSelect />} requiredRole="ROLE_SUPER" />}></Route>
          <Route path="/movie/update/:id" element={<PrivateRoute element={<MovieUpdate />} requiredRole="ROLE_SUPER" />}></Route>

          <Route path="/notice/list" element={<PrivateRoute element={<NoticeList/>} requiredRole="ROLE_SUPER" />}></Route>
          <Route path="/notice/insert" element={<PrivateRoute element={<NoticeInsert />} requiredRole="ROLE_SUPER" />}></Route>
          <Route path="/notice/select/:id" element={<PrivateRoute element={<NoticeSelect />} requiredRole="ROLE_SUPER" />}></Route>
          <Route path="/notice/update/:id" element={<PrivateRoute element={<NoticeUpdate />} requiredRole="ROLE_SUPER" />}></Route>

          <Route path="/reviewManager/list" element={<PrivateRoute element={<ReviewManagerList />} requiredRole="ROLE_SUPER" />}></Route>

          <Route path="/theater/list/:id" element={<TheaterList/>}></Route>
          <Route path="/theater/insert/" element={<TheaterInsert/>}></Route>
          <Route path="/theater/select/" element={<TheaterSelect/>}></Route>
          <Route path="/theater/update/" element={<TheaterUpdate/>}></Route>

          <Route path="/theaterList/list/:id" element={<TheaterListList/>}></Route>
          <Route path="/theaterList/insert/:id" element={<TheaterListInsert/>}></Route>
          <Route path="/theaterList/select/:id/:theaterListId" element={<TheaterListSelect/>}></Route>
          <Route path="/theaterList/update/:id/:theaterListId" element={<TheaterListUpdate/>}></Route>

          <Route path="/auth/list" element={<PrivateRoute element={<AuthList />} requiredRole="ROLE_SUPER" />}></Route>
          <Route path="/auth/insert" element={<PrivateRoute element={<AuthInsert />} requiredRole="ROLE_SUPER" />}></Route>

          <Route path="/user/list" element={<PrivateRoute element={<UserList />} requiredRole="ROLE_SUPER" />}></Route>
          <Route path="/user/select/:id" element={<PrivateRoute element={<UserSelect />} requiredRole="ROLE_SUPER" />}></Route>
          <Route path="/user/update/:id" element={<PrivateRoute element={<UserUpdate />} requiredRole="ROLE_SUPER" />}></Route>


      </Routes>
  )
}

export default admin