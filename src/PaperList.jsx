import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const PAGE_SIZE = 50

function PaperList () {
    const [papersData, setPapersData] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [filteredPapers, setFilteredPapers] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const getPageNumbers = () => {
        const pages = []
        const startPage = Math.max(currentPage - 5, 1)
        const endPage = Math.min(currentPage + 5, totalPages)

        // 添加首页按钮
        if (startPage > 1) {
            pages.push({ type: 'first', display: '首页', number: 1 })
            if (startPage > 2) pages.push({ type: 'ellipsis', display: '...' })
        }

        // 添加页码
        for (let i = startPage; i <= endPage; i++) {
            pages.push({ type: 'number', display: i, number: i })
        }

        // 添加末页按钮
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pages.push({ type: 'ellipsis', display: '...' })
            pages.push({ type: 'last', display: '末页', number: totalPages })
        }

        return pages
    }
    // Load papers data from public directory
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/paper_data.json')
                const data = await response.json()
                setPapersData(data)
                setFilteredPapers(data) // Initialize filtered papers with all papers
            } catch (error) {
                console.error('Error fetching paper data:', error)
            }
        }

        fetchData()
    }, [])

    // Filter papers based on search term
    useEffect(() => {
        const term = searchTerm.toLowerCase()
        const filtered = papersData.filter(
            (paper) =>
                paper.title.toLowerCase().includes(term) ||
                (paper.description && paper.description.toLowerCase().includes(term))
        )
        setFilteredPapers(filtered)
        setCurrentPage(1) // Reset to page 1 when search term changes
    }, [searchTerm, papersData])

    // Pagination handling
    const totalPages = Math.ceil(filteredPapers.length / PAGE_SIZE)



    const paginatedPapers = filteredPapers.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    )

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>论文列表</h1>
            <input
                type="text"
                placeholder="搜索论文..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchBox}
            />
            <div style={styles.paperList}>
                {paginatedPapers.map((paper) => (
                    <div key={paper.id} style={styles.paperCard}>
                        <h3 style={styles.title}>{paper.title}</h3>
                        {paper.author && <p style={styles.author}>{paper.author}</p>}
                        <Link to={`/paper/${paper.id}`} style={styles.link}>
                            查看详情
                        </Link>
                    </div>
                ))}
            </div>
            <div style={styles.pagination}>
                {getPageNumbers().map((page, index) => {
                    const isActive = page.number === currentPage
                    const isNumber = page.type === 'number'
                    const isEdge = page.type === 'first' || page.type === 'last'

                    return (
                        <button
                            key={index}
                            onClick={() => !isActive && setCurrentPage(page.number)}
                            style={{
                                ...styles.baseButton,
                                ...(isEdge && styles.edgeButton),
                                ...(isNumber && styles.numberButton),
                                ...(isActive && styles.activeButton)
                            }}
                            disabled={page.type === 'ellipsis'}
                        >
                            {page.display}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

const styles = {
    container: {
        maxWidth:false,
        padding: '20px',
        width:'100vw',
        backgroundColor: '#f4f8ff',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
    },
    heading: {
        fontSize: '2.5rem',
        color: '#0a3d8d',
        marginBottom: '20px',
        alignItems:'center',
        justifyContent:'center'
    },
    searchBox: {
        padding: '10px',
        fontSize: '1rem',
        borderRadius: '4px',
        border: '1px solid #ccc',
        marginBottom: '20px',
        width: '300px',
        display: 'block',
    },
    paperList: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        margin:'0 auto'
    },
    paperCard: {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        width: '250px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    title: {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        color: '#0a3d8d',
    },
    author: {
        fontSize: '0.875rem',
        color: '#555',
        marginTop: '10px',
    },
    link: {
        marginTop: '10px',
        display: 'inline-block',
        color: '#007bff',
        textDecoration: 'none',
    },
    pagination: {
        marginTop: '20px',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '8px',
    },
    baseButton: {
        padding: '8px 16px',
        border: '1px solid #ddd',
        backgroundColor: '#fff',
        color: '#333', // 新增文字颜色定义
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeButton: {
        backgroundColor: '#0a3d8d',
        color: '#fff',
        borderColor: '#0a3d8d',
        transform: 'translateY(-2px)',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    },

    // 新增悬停效果
    edgeButton: {
        borderRadius: '4px',
        minWidth: '80px',
        '&:hover': {
            backgroundColor: '#f0f0f0'
        }
    },
    numberButton: {
        borderRadius: '50%',
        width: '36px',
        padding: 0,
        minWidth: 'auto',
        '&:hover': {
            backgroundColor: '#f0f0f0'
        }
    },
}

export default PaperList