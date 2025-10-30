import React, { useEffect, useState } from "react";

const DataFetcher = ({ url }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;
    setLoading(true);
    setError(null);
    setData(null);
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [url]);

  if (!url)
    return (
      <div className="max-w-lg mx-auto mt-8 p-8 rounded-xl shadow bg-white font-sans">
        <div className="text-red-700 bg-red-100 border border-red-300 rounded p-4 text-center mb-4">
          No URL provided.
        </div>
      </div>
    );
  if (loading)
    return (
      <div className="max-w-lg mx-auto mt-8 p-8 rounded-xl shadow bg-white font-sans">
        <div className="text-gray-500 font-medium text-center py-6">Loading...</div>
      </div>
    );
  if (error)
    return (
      <div className="max-w-lg mx-auto mt-8 p-8 rounded-xl shadow bg-white font-sans">
        <div className="text-red-700 bg-red-100 border border-red-300 rounded p-4 text-center mb-4">
          Error: {error}
        </div>
      </div>
    );
  return (
    <div className="max-w-lg mx-auto mt-8 p-8 rounded-xl shadow bg-white font-sans">
      <div className="mb-4 text-xl font-semibold text-gray-800">Fetched Data</div>
      <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default DataFetcher;
