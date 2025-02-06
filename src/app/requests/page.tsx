// src/app/requests/page.tsx
'use client';

import { useState } from "react";

export default function RequestsPage() {
  const [selectedMedia, setSelectedMedia] = useState<string>("");
  const [mediaLink, setMediaLink] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen text-center px-4 sm:px-8 md:px-16">
      <h1 className="text-4xl font-bold">Requests</h1>
      <p className="text-lg mt-4">
        Fill out the form below or submit your requests directly to{" "}
        <a
          href="mailto:request@deepnorth.app"
          className="text-blue-400 hover:underline"
        >
          request@deepnorth.app
        </a>
      </p>

      <form className="mt-6 w-full max-w-lg space-y-4">
        {/* Your Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-lg font-semibold"
          >
            Your Name (Required)
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Media Selection */}
        <div>
          <label className="block text-lg font-semibold">Select Media Type (Required)</label>
          
          {/* Grid Layout for Media Selection */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
            {/* eBook */}
            <div className="flex items-center">
              <input
                type="radio"
                id="ebook"
                name="media"
                value="ebook"
                onChange={(e) => setSelectedMedia(e.target.value)}
                className="mr-2"
                required
              />
              <label htmlFor="ebook" className="text-lg">eBook</label>
            </div>
            {/* TV */}
            <div className="flex items-center">
              <input
                type="radio"
                id="tv"
                name="media"
                value="tv"
                onChange={(e) => setSelectedMedia(e.target.value)}
                className="mr-2"
              />
              <label htmlFor="tv" className="text-lg">TV</label>
            </div>
            {/* Audiobook */}
            <div className="flex items-center">
              <input
                type="radio"
                id="audiobook"
                name="media"
                value="audiobook"
                onChange={(e) => setSelectedMedia(e.target.value)}
                className="mr-2"
                required
              />
              <label htmlFor="audiobook" className="text-lg">Audiobook</label>
            </div>
            {/* Movie */}
            <div className="flex items-center">
              <input
                type="radio"
                id="movie"
                name="media"
                value="movie"
                onChange={(e) => setSelectedMedia(e.target.value)}
                className="mr-2"
              />
              <label htmlFor="movie" className="text-lg">Movie</label>
            </div>
          </div>
        </div>

        {/* Title Field */}
        <div>
          <label
            htmlFor="title"
            className="block text-lg font-semibold"
          >
            Title (Required)
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Author Field (Conditional) */}
        {(selectedMedia === "ebook" || selectedMedia === "audiobook") && (
          <div>
            <label
              htmlFor="author"
              className="block text-lg font-semibold"
            >
              Author (Required)
            </label>
            <input
              type="text"
              id="author"
              name="author"
              required
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            />
          </div>
        )}

        {/* Link to Media */}
        <div>
          <label
            htmlFor="mediaLink"
            className="block text-lg font-semibold"
          >
            Link to Media (Required)
          </label>
          <input
            type="url"
            id="mediaLink"
            name="mediaLink"
            value={mediaLink}
            onChange={(e) => setMediaLink(e.target.value)}
            required
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label
            htmlFor="screenshot"
            className="block text-lg font-semibold"
          >
            Upload Screenshot or Image (Required)
          </label>
          <input
            type="file"
            id="screenshot"
            name="screenshot"
            accept="image/*"
            onChange={handleImageUpload}
            required
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
    </main>
  );
}