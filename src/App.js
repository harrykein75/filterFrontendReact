import React, { useState, useEffect } from 'react';
import axios from "axios";

function App() {
    const [searchQuery, setSearchQuery] = useState('');
    const [points, setPoints] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [ordering, setOrdering] = useState('');

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage, searchQuery, ordering]);

    const fetchData = (pageNumber) => {
        console.log(pageNumber, searchQuery, ordering)
        axios.get('http://localhost:8888/main/get_data/', {
            params: {
                page: pageNumber,
                search: searchQuery,
                ordering: ordering
            }
        }).then((response) => {
            setPoints(response.data.results);
            setTotalPages(response.data.total_pages);
            updatePaginationButtons();
        }).catch((error) => {
            console.error('Error fetching data:', error);
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchData(1);
    };

    const handleOrderButtonClick = (orderColumn) => {
        // If the clicked column is already the ordering column, toggle the order direction
        if (ordering === orderColumn) {
            setOrdering(`-${orderColumn}`); // Prefixing '-' for descending order
        } else {
            setOrdering(orderColumn); // Set the ordering column to the clicked column
        }
    };

    const updatePaginationButtons = () => {
        const pageIndicators = [];

        // Add ellipsis if there are more pages before the first indicator
        if (currentPage > 2) {
            pageIndicators.push(<button key={1} className="pageButton" onClick={() => handlePaginationClick(1)}>1</button>);
            if (currentPage > 3) {
                pageIndicators.push(<span key="ellipsis1" className="ellipsis">...</span>);
            }
        }

        // Add up to 3 page indicator buttons
        for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
            pageIndicators.push(<button key={i} className={`pageButton ${i === currentPage ? 'active' : ''}`} onClick={() => handlePaginationClick(i)}>{i}</button>);
        }

        // Add ellipsis if there are more pages after the last indicator
        if (totalPages - currentPage > 1) {
            if (totalPages - currentPage > 2) {
                pageIndicators.push(<span key="ellipsis2" className="ellipsis">...</span>);
            }
            pageIndicators.push(<button key={totalPages} className="pageButton" onClick={() => handlePaginationClick(totalPages)}>{totalPages}</button>);
        }
        return pageIndicators;
    };

    const handlePaginationClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePrevButtonClick = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextButtonClick = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleGoButtonClick = () => {
        const pageNumber = parseInt(document.getElementById('pageNumberInput').value);
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        } else {
            alert('Invalid page number');
        }
    };

    return (
        <div>
            <form id="searchForm" onSubmit={handleSearch}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                />
                <button type="submit">Search</button>
            </form>

            <h1>Points</h1>
            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleOrderButtonClick('location')}>Location</th>
                        <th onClick={() => handleOrderButtonClick('address')}>Address</th>
                        <th onClick={() => handleOrderButtonClick('user')}>User</th>
                        <th onClick={() => handleOrderButtonClick('latitude')}>Latitude</th>
                        <th onClick={() => handleOrderButtonClick('longitude')}>Longitude</th>
                        <th onClick={() => handleOrderButtonClick('visible')}>Visible</th>
                        <th onClick={() => handleOrderButtonClick('date')}>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {points.map((item, index) => (
                        <tr key={index}>
                            <td>{item.location}</td>
                            <td>{item.address}</td>
                            <td>{item.user}</td>
                            <td>{item.latitude}</td>
                            <td>{item.longitude}</td>
                            <td>{item.visible ? 'True': 'False'}</td>
                            <td>{item.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div id="pagination">
                <div id="paginationButtons">
                    <button onClick={handlePrevButtonClick}>&lt;</button>
                    <span id="pageIndicators">{updatePaginationButtons()}</span>
                    <button onClick={handleNextButtonClick}>&gt;</button>
                </div>
                <div id="gotoPage">
                    <input type="number" id="pageNumberInput" min="1" />
                    <button onClick={handleGoButtonClick}>Go</button>
                </div>
            </div>
        </div>
    );
}

export default App;