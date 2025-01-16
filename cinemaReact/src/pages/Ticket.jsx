import React from 'react'
import { Route, Routes } from 'react-router-dom'

import SeatSelection from './movie/SeatSelection/SeatSelection'
import Ticket from './movie/Ticket/Ticket'

const ticket = () => {
  return (
    <Routes>
        <Route path="/DateSelection" element={<Ticket />}></Route>
        <Route path="/SeatSelection" element={<SeatSelection />}></Route>
    </Routes>
  )
}

export default ticket