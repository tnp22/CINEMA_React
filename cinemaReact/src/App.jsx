import './App.css'
import {BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Join from './pages/Join'
import User from './pages/User'
import MyPage from './pages/MyPage'
import MyPageEdit from './pages/MyPageEdit'
import MyPageEdit3 from './pages/MyPageEdit3'
import MyPageReservationList from './pages/MyPageReservationList'
import About from './pages/About'
import Admin from './pages/Admin'
import LoginContextProvider from './contexts/LoginContextProvider'
import Layout from './components/Layout/Layout'
import MovieChart from './pages/movie/movieChart/MovieChart'
import MovieSearch from './pages/movie/Search/MovieSearch'
import MovieInfo from './pages/movie/MovieInfo/MovieInfo'
import Ticket from './pages/Ticket'
import ReviewList from './components/movie/MovieInfo/ReviewList'
import NoticeList from './pages/notice/NoticeList'
import NoticeSelect from './pages/notice/NoticeSelect'
import InquiryList from './pages/inquiry/InquiryList'
import InquirySelect from './pages/inquiry/InquirySelect'
import InquiryInsert from './pages/inquiry/InquiryInsert'
import InquiryUpdate from './pages/inquiry/InquiryUpdate'
import MyInquiryList from './pages/inquiry/MyInquiry/MyInquiryList'
import MyInquirySelect from './pages/inquiry/MyInquiry/MyInquirySelect'
import MyInquiryInsert from './pages/inquiry/MyInquiry/MyInquiryInsert'
import MyInquiryUpdate from './pages/inquiry/MyInquiry/MyInquiryUpdate'


function App() {

  return (
    <BrowserRouter>
      <LoginContextProvider>
        <Routes>
          <Route element={<Layout/>}>
            <Route path="/" element={<Home/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/join" element={<Join/>}></Route>
            <Route path="/user" element={<User/>}></Route>
            <Route path="/mypage" element={<MyPage/>}></Route>
            <Route path="/mypageedit" element={<MyPageEdit/>}></Route>
            <Route path="/mypageedit3" element={<MyPageEdit3/>}></Route>
            <Route path="/mypagereservationlist" element={<MyPageReservationList/>}></Route>
            <Route path="/about" element={<About/>}></Route>
            <Route path="/movie/movieChart" element={<MovieChart/>}></Route>
            <Route path="/movie/search" element={<MovieSearch/>}></Route>
            <Route path="/movie/movieInfo" element={<MovieInfo/>}></Route>
            <Route path="/notice/list" element={<NoticeList/>}></Route>
            <Route path="/notice/select" element={<NoticeSelect/>}></Route>
            <Route path="/Ticket/*" element={<Ticket />}></Route>
            <Route path="/inquiry/list" element={<InquiryList/>}></Route>
            <Route path="/inquiry/select/:id/:password?" element={<InquirySelect/>}></Route>
            <Route path="/inquiry/insert" element={<InquiryInsert/>}></Route>
            <Route path="/inquiry/update/:id" element={<InquiryUpdate/>}></Route>
            <Route path="/user/myInquiry/inquiries" element={<MyInquiryList/>}></Route>
            <Route path="/user/myInquiry/select/:id/" element={<MyInquirySelect/>}></Route>
            <Route path="/user/myInquiry/insert" element={<MyInquiryInsert/>}></Route>
            <Route path="/user/myInquiry/update/:id" element={<MyInquiryUpdate/>}></Route>
          </Route>
            <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </LoginContextProvider>
    </BrowserRouter>
  )
}

export default App
