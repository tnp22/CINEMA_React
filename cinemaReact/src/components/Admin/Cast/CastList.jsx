import React, { useState } from "react";
import { Link } from "react-router-dom";
import $ from 'jquery';
import ResetCs from '../css/Reset.module.css';  // 상대 경로로 CSS 파일 포함
import '../css/Admin.css';  // 상대 경로로 CSS 파일 포함
import LeftSideBar1 from '../LeftSideBar1'

const CastList = () => {


    const [search, setSearch] = useState("");
    const [pageInfo, setPageInfo] = useState({
        list: [],
        pages: 0,
        pageNum: 1,
        prePage: 1,
        nextPage: 2,
        pageSize: 10,
    });

    const history = useHistory();

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // 검색 로직 처리
    };

    const handlePageChange = (page) => {
        // 페이지 변경 처리
    };

    return (
        <div className="container-fluid" style={{ height: "98vh" }}>
            <br />
            <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "start" }}>
                    <a style={{ marginRight: "30px" }} href="/">
                        <img src="/image(id='C:/upload/vora_purple_black.png')" style={{ width: "105px", height: "40px" }} alt="logo" />
                    </a>
                    <h1>
                        <a href="/admin">ADMINISTRATOR : <span className="adminTitle"></span></a>
                    </h1>
                </div>
                <div>
                    <hr className="ms-0" style={{ width: "700px" }} />
                </div>
            </div>
            <div className="row" style={{ height: "90%" }}>
                <LeftSideBar1/>
                <div className="col-md-8" style={{ textAlign: "center", padding: "20px" }}>
                    <h1>출연진 관리</h1>
                    <br />
                    <div className="container mt-5">
                        <table className="table table-striped table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th scope="col">이름</th>
                                    <th scope="col">역할</th>
                                    <th scope="col">영화</th>
                                    <th scope="col">비고</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageInfo.list.map((cast) => (
                                    <tr style={{ lineHeight: "40px" }} key={cast.id}>
                                        <td>{cast.name}</td>
                                        <td>{cast.rule}</td>
                                        <td>{cast.movie.title}</td>
                                        <td>
                                            <button
                                                className="butten"
                                                type="button"
                                                onClick={() => handlePageChange(cast.id)}
                                            >
                                                조회
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="container mt-4">
                            <form action="/admin/cast/list" className="d-flex" method="get" onSubmit={handleSearchSubmit}>
                                <input
                                    className="form-control me-3"
                                    style={{ width: "90%" }}
                                    name="search"
                                    value={search}
                                    onChange={handleSearchChange}
                                    type="search"
                                    placeholder="검색어를 입력하세요"
                                    aria-label="Search"
                                />
                                <input className="btn btn-outline-success" type="submit" value="검색" />
                            </form>
                        </div>
                        {pageInfo.pages > 0 && (
                            <div className="pagination flex justify-content-center">
                                <nav className="mt-4">
                                    <ul className="pagination justify-content-center">
                                        {pageInfo.pageNum > 1 && (
                                            <li className="page-item">
                                                <a className="page-link" onClick={() => handlePageChange(1)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" fill="currentColor" transform="scale(-1, 1)">
                                                        <path d="M224 239L29.66 44.66c-9.37-9.37-24.57-9.37-33.94 0L-26.34 67c-9.37 9.37-9.37 24.57 0 33.94L128.97 256-26.34 410.05c-9.37 9.37-9.37 24.57 0 33.94l22.34 22.34c9.37 9.37 24.57 9.37 33.94 0L224 273c9.37-9.37 9.37-24.57 0-33.94zM448 273L253.66 467.34c-9.37 9.37-24.57 9.37-33.94 0L197.34 445c-9.37-9.37-9.37-24.57 0-33.94L352.97 256 197.34 100.95c-9.37-9.37-9.37-24.57 0-33.94l22.34-22.34c9.37-9.37 24.57-9.37 33.94 0L448 239c9.37 9.37 9.37 24.57 0 33.94z" />
                                                    </svg>
                                                </a>
                                            </li>
                                        )}
                                        {pageInfo.hasPreviousPage && (
                                            <li className="page-item">
                                                <a className="page-link" onClick={() => handlePageChange(pageInfo.prePage)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="16" height="16" fill="currentColor">
                                                        <path d="M34.52 239l194.34-194.34c9.37-9.37 24.57-9.37 33.94 0l22.34 22.34c9.37 9.37 9.37 24.57 0 33.94L128.97 256l156.17 156.17c9.37 9.37 9.37 24.57 0 33.94l-22.34 22.34c-9.37 9.37-24.57 9.37-33.94 0L34.52 273c-9.37-9.37-9.37-24.57 0-33.94z" />
                                                    </svg>
                                                </a>
                                            </li>
                                        )}
                                        {pageInfo.pages > 1 && (
                                            <li className="page-item">
                                                <a className="page-link" onClick={() => handlePageChange(pageInfo.pages)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" fill="currentColor">
                                                        <path d="M224 239L29.66 44.66c-9.37-9.37-24.57-9.37-33.94 0L-26.34 67c-9.37 9.37-9.37 24.57 0 33.94L128.97 256-26.34 410.05c-9.37 9.37-9.37 24.57 0 33.94l22.34 22.34c9.37 9.37 24.57 9.37 33.94 0L224 273c9.37-9.37 9.37-24.57 0-33.94z" />
                                                    </svg>
                                                </a>
                                            </li>
                                        )}
                                    </ul>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-md-2">
                    <div style={{ marginTop: "100px", fontSize: "26px" }}>
                        <ul className="mt-5">
                            <li><a href="/admin/cast/insert">출연진 생성</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <br /><br /><br /><br /><br /><br />
            <br /><br /><br />
        </div>
  )
}

export default CastList