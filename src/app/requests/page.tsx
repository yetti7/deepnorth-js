"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import for navigation

export default function RequestsPage() {
  const router = useRouter();
  const [selectedMedia, setSelectedMedia] = useState<string>("");
  const [mediaLink, setMediaLink] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("Sending...");

    const formData = new FormData(event.target as HTMLFormElement);

    const data = {
      name: formData.get("name"),
      media: selectedMedia,
      title: formData.get("title"),
      author: formData.get("author"),
      mediaLink,
      image: image ? image.name : "",
    };

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      setStatus(response.ok ? "Request submitted successfully!" : "Failed to submit request.");
    } catch (error) {
      console.error("Error:", error);
      setStatus("Failed to submit request.");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen text-center px-4 sm:px-8 md:px-16">
      <h1 className="text-4xl font-bold">Requests</h1>
      <p className="text-lg mt-4">
        Fill out the form below or submit your requests directly to{" "}
        <a href="mailto:requests@deepnorth.app" className="text-blue-400 hover:underline">
          requests@deepnorth.app
        </a>
      </p>

      {/* View Current Requests Button */}
      <button
        onClick={() => router.push("/requests/view")}
        className="mt-6 px-6 py-2 text-lg bg-blue-500 hover:bg-blue-600 text-white rounded-md"
      >
        View Current Requests
      </button>

      <form onSubmit={handleSubmit} className="mt-6 w-full max-w-lg space-y-4">
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

        {/* Image Upload */}
        <div>
          <label htmlFor="screenshot" className="block text-lg font-semibold">Upload Screenshot or Image (Optional)</label>
          <input
            type="file"
            id="screenshot"
            name="screenshot"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
          />
          {image && (
            <div className="mt-2 text-sm text-gray-500">
              <p>Uploaded Image: {image.name}</p>
            </div>
          )}
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

      {status && <p className="mt-4 text-lg">{status}</p>}
    </main>
  );
}