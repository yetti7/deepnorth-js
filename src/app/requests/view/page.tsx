"use client";

import { useEffect, useState } from "react";

interface Request {
  id: number;
  name: string;
  media: string;
  title: string;
  author?: string;
  mediaLink: string;
  image?: string;
  closed_at?: string; // Added for closed requests
}

export default function RequestsViewPage() {
  const [openRequests, setOpenRequests] = useState<Request[]>([]);
  const [closedRequests, setClosedRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

    // ✅ Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      fetchRequests();
    }, 10000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  if (loading) return <p className="text-center text-white">Loading requests...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="flex flex-col items-center p-4">
      {/* Centered Buttons */}
      <div className="mb-6 flex justify-center gap-4 w-full">
        <button
          onClick={() => window.location.href = "/requests"}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Back to Requests Form
        </button>
        <button
          onClick={() => window.location.href = "/requests/manage"}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
        >
          Manage Requests
        </button>
      </div>

      {/* Two-Column Layout */}
      <div className="flex flex-row justify-center w-full max-w-5xl">
        {/* Open Requests Column */}
        <div className="w-1/2 p-4">
          <h2 className="text-2xl font-bold text-center text-white mb-4">Open Requests</h2>
          <ul className="space-y-3 font-[Arial,sans-serif]">
            {openRequests.length > 0 ? (
              openRequests.map((req) => (
                <li key={req.id} className="border border-gray-700 p-3 rounded-md bg-gray-800 text-white">
                  <p className="font-bold">{req.title} ({req.media}) - Requested by {req.name}</p>
                  {req.author && <p>Author: {req.author}</p>}
                  <a href={req.mediaLink} target="_blank" className="text-blue-400 hover:underline">
                    View Request
                  </a>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-400">No open requests.</p>
            )}
          </ul>
        </div>

        {/* Closed Requests Column */}
        <div className="w-1/2 p-4">
          <h2 className="text-2xl font-bold text-center text-white mb-4">Closed Requests</h2>
          <ul className="space-y-3 font-[Arial,sans-serif]">
            {closedRequests.length > 0 ? (
              closedRequests.map((req) => (
                <li key={req.id} className="border border-gray-700 p-3 rounded-md bg-gray-800 text-white">
                  <p className="font-bold">{req.title} ({req.media}) - Requested by {req.name}</p>
                  {req.author && <p>Author: {req.author}</p>}
                  <p className="text-sm text-gray-400">Closed on {new Date(req.closed_at || "").toLocaleDateString()}</p>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-400">No closed requests.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
