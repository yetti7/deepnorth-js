"use client";

import { useState, useEffect } from "react";
import RequestsPagination from "@/components/RequestsPagination"; // Import pagination component

const ADMIN_PASSWORD = "1988"; // Admin page password

interface Request {
  id: number; // sqlite id 
  name: string; // requestor name
  media: string; // media type ie ebook, audiobook, tv, movie
  title: string; //title of media
  author?: string | null; // only populates on ebook and audiobook
  mediaLink: string; // required link to media for quick searching on web
}

export default function RequestsManagePage() {
  const [enteredPassword, setEnteredPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [openRequests, setOpenRequests] = useState<Request[]>([]);
  const [closedRequests, setClosedRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [mediaFilter, setMediaFilter] = useState("");

  // Pagination state
  const [openPage, setOpenPage] = useState(1);
  const [closedPage, setClosedPage] = useState(1);
  const [requestsPerPage, setRequestsPerPage] = useState(5);

  const API_BASE_URL = "https://api.deepnorth.app/api"; // Centralized API base URL

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password. Try again.");
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

  const filterRequests = (requests: Request[]) => {
    return requests.filter((req) =>
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.media.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const markAsCompleted = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/requests/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to mark request as completed.");
      fetchRequests();
    } catch (error) {
      console.error("Error marking request as completed:", error);
    }
  };

  const reopenRequest = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reopen-request/${id}`, { method: "POST" });
      if (!response.ok) throw new Error("Failed to reopen request.");
      fetchRequests();
    } catch (error) {
      console.error("Error reopening request:", error);
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
            className="block w-full p-2 mb-4 text-black"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
            Enter
          </button>
        </form>
      </div>
    );
  }

  const resetFilters = () => {
    setSearchQuery("");
    setMediaFilter("");
  };

  if (loading) return <p className="text-center text-white">Loading requests...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const indexOfLastOpen = openPage * requestsPerPage;
  const indexOfFirstOpen = indexOfLastOpen - requestsPerPage;
  const displayedOpenRequests = filterRequests(openRequests).slice(indexOfFirstOpen, indexOfLastOpen);

  const indexOfLastClosed = closedPage * requestsPerPage;
  const indexOfFirstClosed = indexOfLastClosed - requestsPerPage;
  const displayedClosedRequests = filterRequests(closedRequests).slice(indexOfFirstClosed, indexOfLastClosed);

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
        />
        <select
          value={mediaFilter}
          onChange={(e) => setMediaFilter(e.target.value)}
          className="p-2 border rounded text-black"
        >
          <option value="">All Media</option>
          <option value="Book">Book</option>
          <option value="Audiobook">Audiobook</option>
          <option value="TV Show">TV Show</option>
          <option value="Movie">Movie</option>
        </select>
        <button onClick={resetFilters} className="p-2 bg-red-600 text-white rounded min-w-[120px]">
          Clear Filters
        </button>
      </div>
      <div className="flex flex-col md:flex-row justify-center w-full max-w-5xl">
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-xl font-bold text-center text-white mb-4">Open Requests</h2>
          <ul className="space-y-3 font-[Arial,sans-serif]">
            {displayedOpenRequests.map((req) => (
              <li key={req.id} className="border border-gray-700 p-3 rounded-md bg-gray-800 text-white">
                <p className="font-bold">{req.title} ({req.media}) - Requested by: {req.name}</p>
                {req.author && <p>Author: {req.author}</p>}
                <div className="flex gap-2 mt-2">
                  <a href={req.mediaLink} target="_blank" className="text-blue-400 hover:underline">View Request</a>
                  <button onClick={() => markAsCompleted(req.id)} className="bg-green-600 px-3 py-1 rounded text-white">Mark as Completed</button>
                </div>
              </li>
            ))}
          </ul>
          <RequestsPagination totalRequests={openRequests.length} requestsPerPage={requestsPerPage} currentPage={openPage} onPageChange={setOpenPage} onPerPageChange={setRequestsPerPage} />
        </div>
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-xl font-bold text-center text-white mb-4">Closed Requests</h2>
          <ul className="space-y-3 font-[Arial,sans-serif]">
            {displayedClosedRequests.map((req) => (
              <li key={req.id} className="border border-gray-700 p-3 rounded-md bg-gray-800 text-white">
                <p className="font-bold">{req.title} ({req.media}) - Requested by: {req.name}</p>
                {req.author && <p>Author: {req.author}</p>}
                <div className="flex gap-2 mt-2">
                  <a href={req.mediaLink} target="_blank" className="text-blue-400 hover:underline">View Request</a>
                  <button onClick={() => reopenRequest(req.id)} className="bg-blue-600 px-3 py-1 rounded text-white">Reopen</button>
                  <button onClick={() => setConfirmDelete(req.id)} className="bg-red-600 px-3 py-1 rounded text-white">Delete</button>
                </div>
                {confirmDelete === req.id && (
                  <div className="mt-2 text-center">
                    <p className="text-yellow-400 text-center">Confirm delete?</p>
                    <div className="flex gap-2 justify-center mt-2">
                      <button onClick={() => deleteRequest(req.id)} className="bg-red-700 px-3 py-1 rounded text-white">Yes</button>
                      <button onClick={() => setConfirmDelete(null)} className="bg-gray-500 px-3 py-1 rounded text-white">No</button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <RequestsPagination totalRequests={closedRequests.length} requestsPerPage={requestsPerPage} currentPage={closedPage} onPageChange={setClosedPage} onPerPageChange={setRequestsPerPage} />
        </div>
      </div>
    </div>
  );
}