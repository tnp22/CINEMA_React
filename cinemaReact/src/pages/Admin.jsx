import React from 'react'
import {Route, Routes } from 'react-router-dom'
import AdminMainForm from '../components/Admin/AdminMainForm'
import AddMap from '../components/Admin/AddMap/AddMap'

import BannerInsert from '../components/Admin/Banner/BannerInsert'
import BannerList from '../components/Admin/Banner/BannerList'
import BannerSelect from '../components/Admin/Banner/BannerSelect'
import BannerUpdate from '../components/Admin/Banner/BannerUpdate'

import CastList from '../components/Admin/Cast/CastList'
import CastInsert from '../components/Admin/Cast/CastInsert'
import CastSelect from '../components/Admin/Cast/CastSelect'
import CastUpdate from '../components/Admin/Cast/CastUpdate'

import CinemaInsert from '../components/Admin/Cinema/CinemaInsert'
import CinemaSelect from '../components/Admin/Cinema/CinemaSelect'
import CinemaUpdate from '../components/Admin/Cinema/CinemaUpdate'
import CinemaUpdateList from '../components/Admin/Cinema/CinemaUpdateList'

import MovieList from '../components/Admin/Movie/MovieList'
import MovieInsert from '../components/Admin/Movie/MovieInsert'
import MovieSelect from '../components/Admin/Movie/MovieSelect'
import MovieUpdate from '../components/Admin/Movie/MovieUpdate'

import NoticeList from '../components/Admin/Notice/NoticeList'
import NoticeInsert from '../components/Admin/Notice/NoticeInsert'
import NoticeSelect from '../components/Admin/Notice/NoticeSelect'
import NoticeUpdate from '../components/Admin/Notice/NoticeUpdate'

import ReviewManagerList from '../components/Admin/ReviewManager/ReviewManagerList'

import TheaterList from '../components/Admin/Theater/TheaterList'
import TheaterInsert from '../components/Admin/Theater/TheaterInsert'
import TheaterSelect from '../components/Admin/Theater/TheaterSelect'
import TheaterUpdate from '../components/Admin/Theater/TheaterUpdate'

import TheaterListList from '../components/Admin/TheaterList/TheaterListList'
import TheaterListInsert from '../components/Admin/TheaterList/TheaterListInsert'
import TheaterListSelect from '../components/Admin/TheaterList/TheaterListSelect'
import TheaterListUpdate from '../components/Admin/TheaterList/TheaterListUpdate'

import AuthInsert from '../components/Admin/UserManager/auth/AuthInsert'
import AuthList from '../components/Admin/UserManager/Auth/AuthList'

import UserList from '../components/Admin/UserManager/User/UserList'
import UserSelect from '../components/Admin/UserManager/User/UserSelect'
import UserUpdate from '../components/Admin/UserManager/User/UserUpdate'


const admin = () => {
  return (
      <Routes>
          <Route path="/" element={<AdminMainForm/>}></Route>

          <Route path="/addMap/addMap" element={<AddMap/>}></Route>

          <Route path="/banner/list" element={<BannerList/>}></Route>
          <Route path="/banner/insert" element={<BannerInsert/>}></Route>
          <Route path="/banner/select" element={<BannerSelect/>}></Route>
          <Route path="/banner/update" element={<BannerUpdate/>}></Route>
          
          <Route path="/cast/list" element={<CastList/>}></Route>
          <Route path="/cast/insert" element={<CastInsert/>}></Route>
          <Route path="/cast/select" element={<CastSelect/>}></Route>
          <Route path="/cast/update" element={<CastUpdate/>}></Route>

          <Route path="/cinema/insert" element={<CinemaInsert/>}></Route>
          <Route path="/cinema/select" element={<CinemaSelect/>}></Route>
          <Route path="/cinema/update" element={<CinemaUpdate/>}></Route>
          <Route path="/cinema/updateList" element={<CinemaUpdateList/>}></Route>

          <Route path="/movie/list" element={<MovieInsert/>}></Route>
          <Route path="/movie/insert" element={<MovieList/>}></Route>
          <Route path="/movie/select" element={<MovieSelect/>}></Route>
          <Route path="/movie/update" element={<MovieUpdate/>}></Route>


          <Route path="/notice/list" element={<NoticeList/>}></Route>
          <Route path="/notice/insert" element={<NoticeInsert/>}></Route>
          <Route path="/notice/select" element={<NoticeSelect/>}></Route>
          <Route path="/notice/update" element={<NoticeUpdate/>}></Route>

          <Route path="/reviewManager/reviewManagerList" element={<ReviewManagerList/>}></Route>

          <Route path="/theater/list" element={<TheaterList/>}></Route>
          <Route path="/theater/insert" element={<TheaterInsert/>}></Route>
          <Route path="/theater/select" element={<TheaterSelect/>}></Route>
          <Route path="/theater/update" element={<TheaterUpdate/>}></Route>

          <Route path="/theaterList/list" element={<TheaterListList/>}></Route>
          <Route path="/theaterList/insert" element={<TheaterListInsert/>}></Route>
          <Route path="/theaterList/select" element={<TheaterListSelect/>}></Route>
          <Route path="/theaterList/update" element={<TheaterListUpdate/>}></Route>

          <Route path="/auth/list" element={<AuthList/>}></Route>
          <Route path="/auth/insert" element={<AuthInsert/>}></Route>

          <Route path="/user/list" element={<UserList/>}></Route>
          <Route path="/user/insert" element={<UserSelect/>}></Route>
          <Route path="/user/select" element={<UserUpdate/>}></Route>

      </Routes>
  )
}

export default admin