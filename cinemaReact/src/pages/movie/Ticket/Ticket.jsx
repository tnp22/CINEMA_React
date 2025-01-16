import React, { useEffect, useState } from 'react'
import TicketFrom from '../../../components/movie/ticket/ticketFrom'
import * as ticket from '../../../apis/ticket'
const Ticket = () => {

  const [movie, setMovie] = useState();
  const [ticketList, setTicketList] = useState([]);
  const [movieTitle, setMovieTitle] = useState([]);

  const getdata = async() => {
    try {
      // 주소에서 불러오자
      const searchParams = new URLSearchParams(location.search);
      const movieId = searchParams.get("id");
      // const movieId = '9f180c2e-5260-41e0-870e-e2511a693985';
      const headers = {
        'Content-Type' : 'multupart/form-data'
      }
      const response = await ticket.dateSelection(movieId, headers)
      const data = response.data;
      // console.log(data.movie.id);
      // console.dir(data.ticketList);
      
      setMovie(data.movieId)
      setTicketList(data.ticketList)
      setMovieTitle(data.movieTitle);

    } catch (error) {
      console.error('에러 :' , error);
      
    }
  }

  useEffect(() => {
    getdata();
  }, [])
  

  return (
    <>
    <TicketFrom movie = {movie} ticketList1 = {ticketList} movieTitle = {movieTitle}/>
    </>
  )
}

export default Ticket