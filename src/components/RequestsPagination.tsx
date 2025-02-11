interface RequestsPaginationProps {
    totalRequests: number;
    requestsPerPage: number;
    currentPage: number;
    onPageChange: (newPage: number) => void;
    onPerPageChange: (newPerPage: number) => void;
  }
  
  const RequestsPagination = ({
    totalRequests,
    requestsPerPage,
    currentPage,
    onPageChange,
    onPerPageChange,
  }: RequestsPaginationProps) => {
    const totalPages = Math.ceil(totalRequests / requestsPerPage);
    const hasPrev = currentPage > 1;
    const hasNext = currentPage < totalPages;
  
    return (
      <div className="pagination-controls" style={{ fontFamily: 'Arial, sans-serif', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
        {totalPages > 1 && (
          <>
            <button onClick={() => onPageChange(currentPage - 1)} disabled={!hasPrev}>
              Previous
            </button>
            <span>
              {currentPage} of {totalPages || 1}
            </span>
            <button onClick={() => onPageChange(currentPage + 1)} disabled={!hasNext}>
              Next
            </button>
          </>
        )}
        <select
          value={requestsPerPage}
          onChange={(e) => onPerPageChange(Number(e.target.value))}
          style={{ 
            fontFamily: 'Arial, sans-serif', 
            color: 'black', 
            backgroundColor: 'white', 
            padding: '5px', 
            borderRadius: '4px', 
            border: '1px solid #ccc' 
          }}
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
        </select>
      </div>
    );
  };
  
  export default RequestsPagination;