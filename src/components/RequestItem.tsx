import React, { useState } from "react"; 

interface Request {
  id: number;
  name: string;
  media: string;
  title: string;
  author?: string | null;
  mediaLink: string;
  status: string;
}

interface Props {
  req: Request;
  handleStatusChange?: (id: number, newStatus: string) => void;
  confirmDeleteRequest?: (id: number) => void;
  searchQuery?: string; // ✅ New prop for filtering
  readOnly?: boolean;
}

const RequestItem: React.FC<Props> = ({ req, handleStatusChange, confirmDeleteRequest, readOnly }) => {
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  return (
    <li 
      key={req.id} 
      className="relative border border-gray-700 p-3 rounded-md bg-gray-800 text-white"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      {/* Status Bar */}
      <div className={`absolute left-0 top-0 h-full w-2 rounded-l-md ${
        req.status === "Completed" ? "bg-green-500" :
        req.status === "Unreleased" ? "bg-yellow-500" :
        req.status === "Unavailable" ? "bg-red-500" :
        "bg-gray-600"
      }`}></div>

      {/* Request Details */}
      <p className="font-bold">{req.title} ({req.media}) - Requested by: {req.name}</p>
      {req.author && <p>Author: {req.author}</p>}

      {/* Actions */}
      <div className="flex gap-2 mt-2">
        <a 
          href={req.mediaLink} 
          target="_blank" 
          className="text-blue-400 hover:underline"
        >
          View Request
        </a>

        {/* Status: Show as Text for Read-Only, Dropdown for Manage Requests */}
        {readOnly ? (
        <span className="px-3 py-1 bg-gray-700 text-white rounded">
            {req.status}
        </span>
        ) : (
        <select 
            value={req.status} 
            onChange={(e) => handleStatusChange?.(req.id, e.target.value)} 
            className="bg-gray-700 text-white p-2 rounded"
        >
            <option value="Pending">📖 Pending</option>
            <option value="Unreleased">🟡 Unreleased</option>
            <option value="Completed">✅ Completed</option>
            <option value="Unavailable">❌ Unavailable</option>
        </select>
        )}

        {/* Delete Button (Only for Closed Requests) */}
        {confirmDeleteRequest && (
          <button 
            onClick={() => setConfirmDelete(true)} 
            className="bg-red-600 px-3 py-1 rounded text-white"
          >
            Delete
          </button>
        )}
      </div>

      {/* Confirm Delete Box */}
      {confirmDelete && (
        <div className="mt-2 text-center">
          <p className="text-yellow-400">Confirm delete?</p>
          <div className="flex gap-2 justify-center mt-2">
            <button 
              onClick={() => confirmDeleteRequest?.(req.id)} 
              className="bg-red-700 px-3 py-1 rounded text-white"
            >
              Yes
            </button>
            <button 
              onClick={() => setConfirmDelete(false)} 
              className="bg-gray-500 px-3 py-1 rounded text-white"
            >
              No
            </button>
          </div>
        </div>
      )}
    </li>
  );
};

export default RequestItem;