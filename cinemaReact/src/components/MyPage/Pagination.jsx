import React, { useEffect, useState } from 'react';

const Pagination = ({pageData }) => {
    const [reservationList, setReservationList] = useState([])

    useEffect( () => {
        console.log("페이지네이션",reservationList);
        
    }, [reservationList])

    useEffect( () =>{
        setReservationList(pageData)
    }, [])
  return (
    reservationList.pages > 0 && (
      <div className="pagination flex justify-content-center" style={{ margin: '30px 0' }}>
        <ul style={{ display: 'flex', listStyleType: 'none', gap: '10px' }}>
          {reservationList.pageNum > 1 && (
            <li>
              <a href={`/mypagereservationlist?page=1`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" className="icon" transform="scale(-1, 1)">
                <path d="M224 239L29.66 44.66c-9.37-9.37-24.57-9.37-33.94 0L-26.34 67c-9.37 9.37-9.37 24.57 0 33.94L128.97 256-26.34 410.05c-9.37 9.37-9.37 24.57 0 33.94l22.34 22.34c9.37 9.37 24.57 9.37 33.94 0L224 273c9.37-9.37 9.37-24.57 0-33.94zM448 273L253.66 467.34c-9.37 9.37-24.57 9.37-33.94 0L197.34 445c-9.37-9.37-9.37-24.57 0-33.94L352.97 256 197.34 100.95c-9.37-9.37-9.37-24.57 0-33.94l22.34-22.34c9.37-9.37 24.57-9.37 33.94 0L448 239c9.37 9.37 9.37 24.57 0 33.94z" />
                </svg>
              </a>
            </li>
          )}
          {reservationList.hasPreviousPage && (
            <li>
              <a href={`/mypagereservationlist?page=${reservationList.prePage}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="16" height="16" className="icon">
              <path d="M34.52 239l194.34-194.34c9.37-9.37 24.57-9.37 33.94 0l22.34 22.34c9.37 9.37 9.37 24.57 0 33.94L128.97 256l156.17 156.17c9.37 9.37 9.37 24.57 0 33.94l-22.34 22.34c-9.37 9.37-24.57 9.37-33.94 0L34.52 273c-9.37-9.37-9.37-24.57 0-33.94z" />
            </svg>
              </a>
            </li>
          )}
          {Array.from({ length: reservationList.navigateLastPage - reservationList.navigateFirstPage + 1 }, (_, index) => reservationList.navigateFirstPage + index)
            .map(i => (
              <li key={i}>
                <a href={`mypagereservationlist?page=${i}`} 
                   className={`page ${reservationList.pageNum === i ? 'active' : ''}`}>
                  {i}
                </a>
              </li>
            ))}
          {reservationList.hasNextPage && (
            <li>
              <a href={`/mypagereservationlist?page=${reservationList.nextPage}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="16" height="16" className="icon">
              <path d="M285.48 273l-194.34 194.34c-9.37 9.37-24.57 9.37-33.94 0l-22.34-22.34c-9.37-9.37-9.37-24.57 0-33.94L191.03 256 34.86 99.83c-9.37-9.37-9.37-24.57 0-33.94l22.34-22.34c9.37-9.37 24.57-9.37 33.94 0L285.48 239c9.37 9.37 9.37 24.57 0 33.94z" />
            </svg>
              </a>
            </li>
          )}
          {reservationList.pageNum < reservationList.pages && (
            <li>
              <a href={`/mypagereservationlist?page=${reservationList.pages}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" className="icon">
              <path d="M224 239L29.66 44.66c-9.37-9.37-24.57-9.37-33.94 0L-26.34 67c-9.37 9.37-9.37 24.57 0 33.94L128.97 256-26.34 410.05c-9.37 9.37-9.37 24.57 0 33.94l22.34 22.34c9.37 9.37 24.57 9.37 33.94 0L224 273c9.37-9.37 9.37-24.57 0-33.94zM448 273L253.66 467.34c-9.37 9.37-24.57 9.37-33.94 0L197.34 445c-9.37-9.37-9.37-24.57 0-33.94L352.97 256 197.34 100.95c-9.37-9.37-9.37-24.57 0-33.94l22.34-22.34c9.37-9.37 24.57-9.37 33.94 0L448 239c9.37 9.37 9.37 24.57 0 33.94z" />
            </svg>
              </a>
            </li>
          )}
        </ul>
      </div>
    )
  );
};

export default Pagination;
