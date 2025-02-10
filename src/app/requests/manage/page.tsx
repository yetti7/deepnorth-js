"use client";

import { useState, useEffect } from "react";

const ADMIN_PASSWORD = "Harmony7skitzo1988!"; // Change this!

interface Request {
  id: number;
  name: string;
  media: string;
  title: string;
  author?: string | null;
  mediaLink: string;
  image?: string;
}

export default function RequestsManagePage() {
  const [enteredPassword, setEnteredPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [openRequests, setOpenRequests] = useState<Request[]>([]);
  const [closedRequests, setClosedRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

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
        fetch("http://localhost:3001/api/requests"),
        fetch("http://localhost:3001/api/closed-requests"),
      ]);

      if (!openRes.ok || !closedRes.ok) {
        throw new Error("Failed to fetch requests.");
      }

      const openData = await openRes.json();
      const closedData = await closedRes.json();

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
    if (isAuthenticated) {
      fetchRequests();
    }
  }, [isAuthenticated]);

  const markAsCompleted = async (id: number) => {
    await fetch(`http://localhost:3001/api/requests/${id}`, { method: "DELETE" });
    fetchRequests();
  };

  const reopenRequest = async (id: number) => {
    await fetch(`http://localhost:3001/api/reopen-request/${id}`, { method: "POST" });
    fetchRequests();
  };

  const deleteRequest = async (id: number) => {
    if (confirmDelete !== id) return;
    await fetch(`http://localhost:3001/api/closed-requests/${id}`, { method: "DELETE" });
    setConfirmDelete(null);
    fetchRequests();
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

  if (loading) return <p className="text-center text-white">Loading requests...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold text-white mb-6">Manage Requests</h1>
      <div className="flex flex-row justify-center w-full max-w-5xl">
        <div className="w-1/2 p-4">
          <h2 className="text-xl font-bold text-center text-white mb-4">Open Requests</h2>
          <ul className="space-y-3 font-[Arial,sans-serif]">
            {openRequests.map((req) => (
              <li key={req.id} className="border border-gray-700 p-3 rounded-md bg-gray-800 text-white">
                <p className="font-bold">{req.title} ({req.media}) - Requested by: {req.name}</p>
                {req.author && <p>Author: {req.author}</p>}
                <a href={req.mediaLink} target="_blank" className="text-blue-400 hover:underline">View Request</a>
                <button onClick={() => markAsCompleted(req.id)} className="bg-green-600 px-3 py-1 rounded ml-2 text-white">Mark as Completed</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-1/2 p-4">
          <h2 className="text-xl font-bold text-center text-white mb-4">Closed Requests</h2>
          <ul className="space-y-3 font-[Arial,sans-serif]">
            {closedRequests.map((req) => (
              <li key={req.id} className="border border-gray-700 p-3 rounded-md bg-gray-800 text-white">
                <p className="font-bold">{req.title} ({req.media}) - Requested by: {req.name}</p>
                {req.author && <p>Author: {req.author}</p>}
                <a href={req.mediaLink} target="_blank" className="text-blue-400 hover:underline">View Request</a>
                <button onClick={() => reopenRequest(req.id)} className="bg-blue-600 px-3 py-1 rounded ml-2 text-white">Reopen Request</button>
                <button onClick={() => setConfirmDelete(req.id)} className="bg-red-600 px-3 py-1 rounded ml-2 text-white">Delete Request</button>
                {confirmDelete === req.id && (
                  <div className="mt-2 text-center">
                    <p className="text-yellow-400">Confirm delete?</p>
                    <button onClick={() => deleteRequest(req.id)} className="bg-red-700 px-3 py-1 rounded text-white">Yes</button>
                    <button onClick={() => setConfirmDelete(null)} className="bg-gray-500 px-3 py-1 rounded ml-2 text-white">No</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}