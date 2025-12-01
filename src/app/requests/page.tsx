"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RequestsPage() {
  const router = useRouter();
  const [selectedMedia, setSelectedMedia] = useState<string>("");
  const [mediaLink, setMediaLink] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    formData.append("media", selectedMedia);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      if (response.ok) {
        setShowSuccessModal(true); // ✅ Show success modal
      } else {
        alert("Failed to submit request."); // Show error message
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to submit request.");
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    // ✅ Reset form fields
    setSelectedMedia("");
    setMediaLink("");
    (document.getElementById("request-form") as HTMLFormElement)?.reset(); // ✅ Fix TypeScript reset error
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen text-center px-4 sm:px-8 md:px-16">
      <h1 className="text-4xl font-bold">Requests</h1>
      <p className="text-lg mt-4">
        Fill out the form below
      </p>

      <button
        onClick={() => router.push("/requests/view")}
        className="mt-6 px-6 py-2 text-lg bg-blue-500 hover:bg-blue-600 text-white rounded-md"
      >
        View Current Requests
      </button>

      {/* ✅ Add form ID for reset functionality */}
      <form id="request-form" onSubmit={handleSubmit} className="mt-6 w-full max-w-lg space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-lg font-semibold">
            Your Name (Required)
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full mt-2 p-2 border border-gray-300 rounded-md text-gray-800 font-sans"
          />
        </div>

        {/* Media Selection */}
        <div>
          <label className="block text-lg font-semibold">Select Media Type (Required)</label>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
            {["ebook", "tv", "audiobook", "movie"].map((type) => (
              <div key={type} className="flex items-center">
                <input
                  type="radio"
                  id={type}
                  name="media"
                  value={type}
                  checked={selectedMedia === type}
                  onChange={(e) => setSelectedMedia(e.target.value)}
                  className="mr-2"
                  required
                />
                <label htmlFor={type} className="text-lg capitalize">{type}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-lg font-semibold">Title (Required)</label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full mt-2 p-2 border border-gray-300 rounded-md text-gray-800 font-sans"
          />
        </div>

        {/* Author Field (Conditional) */}
        {(selectedMedia === "ebook" || selectedMedia === "audiobook") && (
          <div>
            <label htmlFor="author" className="block text-lg font-semibold">Author (Required)</label>
            <input
              type="text"
              id="author"
              name="author"
              required
              className="w-full mt-2 p-2 border border-gray-300 rounded-md text-gray-800 font-sans"
            />
          </div>
        )}

        {/* Link to Media */}
        <div>
          <label htmlFor="mediaLink" className="block text-lg font-semibold">Link to Media (Required)</label>
          <input
            type="url"
            id="mediaLink"
            name="mediaLink"
            value={mediaLink}
            onChange={(e) => setMediaLink(e.target.value)}
            required
            className="w-full mt-2 p-2 border border-gray-300 rounded-md text-gray-800 font-sans"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          >
            Submit Request
          </button>
        </div>
      </form>

      {/* ✅ Success Modal with Black Text */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center text-black">
            <h2 className="text-xl font-bold mb-4">Request Submitted</h2>
            <p>Your request has been successfully submitted!</p>
            <button
              onClick={handleCloseModal}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </main>
  );
}