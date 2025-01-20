import React from 'react'
import { Route, Routes } from 'react-router-dom'

import SeatSelection from './movie/SeatSelection/SeatSelection'
import Ticket from './movie/Ticket/Ticket'
import Payment from './movie/payment/Payment'
import ReserveList from './movie/ReserveList/ReserveList'

const ticket = () => {
  return (
    <Routes>
        <Route path="/DateSelection" element={<Ticket />}></Route>
        <Route path="/SeatSelection" element={<SeatSelection />}></Route>
        <Route path="/Payment" element={<Payment />}></Route>
        <Route path="/ReserveList" element={<ReserveList />}></Route>
    </Routes>
  )
}

export default ticket