import './App.css'
import {BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Join from './pages/Join'
import User from './pages/User'
import MyPage from './pages/MyPage'
import MyPageEdit from './pages/MyPageEdit'
import MyPageReservationList from './pages/MyPageReservationList'
import About from './pages/About'
import Admin from './pages/Admin'
import LoginContextProvider from './contexts/LoginContextProvider'
import Layout from './components/Layout/Layout'
import MovieChart from './pages/movie/movieChart/MovieChart'
import MovieSearch from './pages/movie/Search/MovieSearch'
import MovieInfo from './pages/movie/MovieInfo/MovieInfo'
import Ticket from './pages/Ticket'

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
            <Route path="/mypagereservationlist" element={<MyPageReservationList/>}></Route>
            <Route path="/about" element={<About/>}></Route>
            <Route path="/movie/movieChart" element={<MovieChart/>}></Route>
            <Route path="/movie/search" element={<MovieSearch/>}></Route>
            <Route path="/movie/movieInfo" element={<MovieInfo/>}></Route>
          </Route>
            <Route path="/Ticket/*" element={<Ticket />}></Route>
            <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </LoginContextProvider>
    </BrowserRouter>
  )
}

export default App
