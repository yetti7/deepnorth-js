"use client";

import { useState, useEffect } from "react";
import RequestsPagination from "@/components/RequestsPagination";
import RequestItem from "@/components/RequestItem";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "default";

interface Request {
  id: number; 
  name: string; 
  media: string; // eBook, Audiobook, TV, Movie
  title: string;
  author?: string | null; 
  mediaLink: string;
  status: string; // Pending, Completed, Unreleased, Unavailable
}

export default function RequestsManagePage() {
  //  Authentication State
  const [enteredPassword, setEnteredPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  //  Request Data State
  const [openRequests, setOpenRequests] = useState<Request[]>([]);
  const [closedRequests, setClosedRequests] = useState<Request[]>([]);

  //  UI State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  //  Filtering & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [mediaFilter, setMediaFilter] = useState("");
  
  //  Pagination State
  const [openPage, setOpenPage] = useState(1);
  const [closedPage, setClosedPage] = useState(1);
  const [requestsPerPage, setRequestsPerPage] = useState(5);

  //  Apply Filtering
  const filteredOpenRequests = openRequests.filter((req) =>
    (req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.media.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (mediaFilter === "" || req.media.toLowerCase() === mediaFilter.toLowerCase())
  );

  const filteredClosedRequests = closedRequests.filter((req) =>
    (req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.media.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (mediaFilter === "" || req.media.toLowerCase() === mediaFilter.toLowerCase())
  );

  //  Apply Pagination
  const indexOfLastOpen = openPage * requestsPerPage;
  const indexOfFirstOpen = indexOfLastOpen - requestsPerPage;
  const displayedOpenRequests = filteredOpenRequests.slice(indexOfFirstOpen, indexOfLastOpen);

  const indexOfLastClosed = closedPage * requestsPerPage;
  const indexOfFirstClosed = indexOfLastClosed - requestsPerPage;
  const displayedClosedRequests = filteredClosedRequests.slice(indexOfFirstClosed, indexOfLastClosed);

  const API_BASE_URL = "https://api.deepnorth.app/api"; // Centralized API base URL

  //  Track failed attempts & lockout time
const [failedAttempts, setFailedAttempts] = useState(0);
const [lockoutTime, setLockoutTime] = useState<number | null>(null);

useEffect(() => {
  const savedLockout = localStorage.getItem("adminLockout");
  const savedAttempts = localStorage.getItem("adminFailedAttempts");

  if (savedLockout) setLockoutTime(Number(savedLockout));
  if (savedAttempts) setFailedAttempts(Number(savedAttempts));
}, []);

// ✅ Helper function to check if locked out
const isLockedOut = () => lockoutTime && Date.now() < lockoutTime;

const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();

  if (isLockedOut()) {
    alert("🚨 Too many failed attempts. Try again later.");
    return;
  }

  if (enteredPassword === ADMIN_PASSWORD) {
    setIsAuthenticated(true);
    setFailedAttempts(0);
    localStorage.removeItem("adminLockout");
    localStorage.removeItem("adminFailedAttempts");
  } else {
    const newAttempts = failedAttempts + 1;
    setFailedAttempts(newAttempts);
    localStorage.setItem("adminFailedAttempts", newAttempts.toString());

    if (newAttempts >= 3) {
      const lockUntil = Date.now() + 5 * 60 * 1000; // 5-minute lockout
      localStorage.setItem("adminLockout", lockUntil.toString());
      setLockoutTime(lockUntil);
      alert("🚨 Too many failed attempts. Try again in 5 minutes.");
    } else {
      alert(`❌ Incorrect password. Attempts remaining: ${3 - newAttempts}`);
    }
  }
};

  const fetchRequests = async () => {
    try {
      const [openRes, closedRes] = await Promise.all([
        fetch(`${API_BASE_URL}/requests`),
        fetch(`${API_BASE_URL}/closed-requests`),
      ]);

      if (!openRes.ok || !closedRes.ok) {
        throw new Error("Failed to fetch requests.");
      }

      setOpenRequests(await openRes.json());
      setClosedRequests(await closedRes.json());
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError("Failed to load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchRequests();
  }, [isAuthenticated]);

  const markAsClosed = async (id: number, status: string) => {
    console.log(`🚀 Sending move-to-closed request: ID = ${id}, Status = ${status}`); // Debug log
  
    try {
      const response = await fetch(`${API_BASE_URL}/move-to-closed`, {
        method: "POST", // ✅ Change DELETE to POST
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }), // ✅ Ensure status is sent
      });
  
      if (!response.ok) throw new Error(`Failed to mark request as ${status}.`);
  
      fetchRequests();
    } catch (error) {
      console.error(`❌ Error marking request as ${status}:`, error);
    }
  };

  const deleteRequest = async (id: number) => {
    if (confirmDelete !== id) return;
    try {
      const response = await fetch(`${API_BASE_URL}/closed-requests/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete request.");
      setConfirmDelete(null);
      fetchRequests();
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-white mb-4">Admin Access</h1>
        <form onSubmit={handleLogin} className="bg-gray-800 p-6 rounded-md shadow-md">
          <input
            type="password"
            placeholder="Enter password"
            value={enteredPassword}
            onChange={(e) => setEnteredPassword(e.target.value)}
            className="block w-full p-2 mb-4 border border-gray-400 rounded bg-white text-black font-sans"
            style={{ fontFamily: "Arial, sans-serif" }}
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md font-sans w-full max-w-[200px] text-center">
            Submit
          </button>
        </form>
      </div>
    );
  }

  const resetFilters = () => {
    setSearchQuery("");
    setMediaFilter("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-white">Loading requests...</p>
      </div>
    );
  }
  if (error) return <p className="text-center text-red-500">{error}</p>;
  
  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const isClosedRequest = closedRequests.some((req) => req.id === id);
  
      if (isClosedRequest && (newStatus === "Pending" || newStatus === "Unreleased")) {
        await fetch(`${API_BASE_URL}/reopen-request/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
        fetchRequests();
        return;
      }
  
      if (!isClosedRequest && (newStatus === "Completed" || newStatus === "Unavailable")) {
        markAsClosed(id, newStatus); // ✅ Just call it, no need to assign a value
        return;
      }
  
      const endpoint = isClosedRequest ? "update-closed-status" : "update-status";
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update status");
      }
  
      fetchRequests();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold text-white mb-6">Manage Requests</h1>
      <div className="mb-4 flex flex-wrap justify-center items-center gap-4 w-full max-w-lg">
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="p-2 border rounded text-black flex-1 min-w-[250px]"
        style={{ fontFamily: "Arial, sans-serif" }} // ✅ Force Arial
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
        <button onClick={resetFilters} className="p-2 bg-red-600 text-white rounded min-w-[120px]">
          Clear Filters
        </button>
      </div>
      <div className="flex flex-col md:flex-row justify-center w-full max-w-5xl">
      <div className="w-full md:w-1/2 p-4">
  <h2 className="text-xl font-bold text-center text-white mb-4">Open Requests</h2>
  <ul className="space-y-3">
    {displayedOpenRequests.map((req) => (
      <RequestItem 
        key={req.id} 
        req={req} 
        handleStatusChange={handleStatusChange} 
      />
    ))}
  </ul>
  <RequestsPagination 
    totalRequests={filteredOpenRequests.length} 
    requestsPerPage={requestsPerPage} 
    currentPage={openPage} 
    onPageChange={setOpenPage} 
    onPerPageChange={setRequestsPerPage} 
  />
</div>
<div className="w-full md:w-1/2 p-4">
  <h2 className="text-xl font-bold text-center text-white mb-4">Closed Requests</h2>
  <ul className="space-y-3">
    {displayedClosedRequests.map((req) => (
      <RequestItem 
        key={req.id} 
        req={req} 
        handleStatusChange={handleStatusChange} 
        confirmDeleteRequest={deleteRequest} 
      />
    ))}
  </ul>
  <RequestsPagination 
    totalRequests={filteredClosedRequests.length} 
    requestsPerPage={requestsPerPage} 
    currentPage={closedPage} 
    onPageChange={setClosedPage} 
    onPerPageChange={setRequestsPerPage} 
  />
</div>
      </div>
    </div>
  );
}