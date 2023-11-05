import React, { useState } from "react";

const UploadDocs = (): JSX.Element => {
  const [url, setUrl] = useState<string>("");
  const [subject, setSubject] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission behavior
    try {
      const response = await fetch("/api/upload/website", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, subject }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      // Handle success - maybe clear the form or show a success message
    } catch (error) {
      console.error("Error uploading document:", error);
      // Handle error - show error message to user
    }
  };

  return (
    <div className="flex flex-col items-center p-24">
      <h1 className="font-bold text-5xl mb-6">URL Upload</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="mb-4">
          <label htmlFor="url" className="block text-sm font-bold mb-2">
            URL to upload
          </label>
          <input
            type="text"
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="url"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="subject" className="block text-sm font-bold mb-2">
            Subject
          </label>
          <input
            type="text"
            placeholder="Enter subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="subject"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Upload
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadDocs;
