"use client";

import { useEffect, useState } from "react";
import RequestsPagination from "@/components/RequestsPagination"; // Import the pagination component
import RequestItem from "@/components/RequestItem";
interface Request {
  id: number;
  name: string;
  media: string;
  title: string;
  author?: string;
  mediaLink: string;
  image?: string;
  closed_at?: string; // Added for closed requests
  status: string
}

export default function RequestsViewPage() {
  const [openRequests, setOpenRequests] = useState<Request[]>([]);
  const [closedRequests, setClosedRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mediaFilter, setMediaFilter] = useState("");

  // Pagination state
  const [openPage, setOpenPage] = useState(1);
  const [closedPage, setClosedPage] = useState(1);
  const [requestsPerPage, setRequestsPerPage] = useState(5);

  const fetchRequests = async () => {
    try {
      const [openRes, closedRes] = await Promise.all([
        fetch("https://api.deepnorth.app/api/requests"),
        fetch("https://api.deepnorth.app/api/closed-requests"),
      ]);
  
      if (!openRes.ok || !closedRes.ok) {
        throw new Error("Failed to fetch requests.");
      }
  
      const openData = await openRes.json();
      const closedData = await closedRes.json();
  
      console.log("🟢 Open Requests:", openData); // ✅ Debug log
      console.log("🔴 Closed Requests:", closedData); // ✅ Debug log
  
      setOpenRequests(openData);
      setClosedRequests(closedData);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError("Failed to load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(() => {
      fetchRequests();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const filterRequests = (requests: Request[]) => {
    return requests.filter((req) =>
      (req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.media.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (mediaFilter ? req.media.toLowerCase() === mediaFilter.toLowerCase() : true)
    );
  };

  const resetFilters = () => {
    setSearchQuery("");
    setMediaFilter("");
  };

  if (loading) return <p className="text-center text-white">Loading requests...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  // Pagination logic: Slice requests for current page
  const indexOfLastOpen = openPage * requestsPerPage;
  const indexOfFirstOpen = indexOfLastOpen - requestsPerPage;
  const displayedOpenRequests = filterRequests(openRequests).slice(indexOfFirstOpen, indexOfLastOpen);

  const indexOfLastClosed = closedPage * requestsPerPage;
  const indexOfFirstClosed = indexOfLastClosed - requestsPerPage;
  const displayedClosedRequests = filterRequests(closedRequests).slice(indexOfFirstClosed, indexOfLastClosed);

  return (
    <div className="flex flex-col items-center p-4">
      <div className="mb-6 flex flex-col md:flex-row justify-center gap-4 w-full">
        <button onClick={() => window.location.href = "/requests"} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full md:w-auto">
          Request Form
        </button>
        <button onClick={() => window.location.href = "/requests/manage"} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 w-full md:w-auto">
          Manage Requests
        </button>
      </div>
      <div className="mb-4 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded text-black font-[Arial,sans-serif]"
        />
        <select
          value={mediaFilter}
          onChange={(e) => setMediaFilter(e.target.value)}
          className="p-2 border rounded text-black"
        >
          <option value="">All Media</option>
          <option value="eBook">eBook</option>
          <option value="Audiobook">Audiobook</option>
          <option value="TV">TV Show</option>
          <option value="Movie">Movie</option>
        </select>
        <button onClick={resetFilters} className="p-2 bg-red-500 text-black rounded">
          Clear Filters
        </button>
      </div>
      <div className="flex flex-col md:flex-row justify-center w-full max-w-5xl">
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-2xl font-bold text-center text-white mb-4">Open Requests</h2>
          <ul className="space-y-3 font-[Arial,sans-serif]">
            {displayedOpenRequests.length > 0 ? (
              displayedOpenRequests.map((req) => (
                <RequestItem 
                  key={req.id} 
                  req={req} 
                  readOnly={true} // ✅ View page should be read-only
                />
              ))
            ) : (
              <p className="text-center text-gray-400">No open requests.</p>
            )}
          </ul>
          <RequestsPagination totalRequests={openRequests.length} requestsPerPage={requestsPerPage} currentPage={openPage} onPageChange={setOpenPage} onPerPageChange={setRequestsPerPage} />
        </div>
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-2xl font-bold text-center text-white mb-4">Closed Requests</h2>
          <ul className="space-y-3 font-[Arial,sans-serif]">
            {displayedClosedRequests.length > 0 ? (
              displayedClosedRequests.map((req) => (
                <RequestItem 
                  key={req.id} 
                  req={req} 
                  readOnly={true} // ✅ View page should be read-only
                />
              ))
            ) : (
              <p className="text-center text-gray-400">No closed requests.</p>
            )}
          </ul>
          <RequestsPagination totalRequests={closedRequests.length} requestsPerPage={requestsPerPage} currentPage={closedPage} onPageChange={setClosedPage} onPerPageChange={setRequestsPerPage} />
        </div>
      </div>
    </div>
  );
}
