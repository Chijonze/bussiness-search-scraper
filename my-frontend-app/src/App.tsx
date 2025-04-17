import React, { useState } from 'react';
import axios from 'axios';

// Define the type for a business
interface Business {
  name: string;
  address: string;
  website: string | null;
  place_id: string;
  phone: string | null; // Ensure this field is defined
}

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('Clothing in jlegun');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch businesses from the backend
  const fetchBusinesses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/businesses`, {
        params: { query },
      });
      console.log(response.data); // Log the data to verify phone numbers
      setBusinesses(response.data);
    } catch (err) {
      setError('Failed to fetch businesses. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Business Search</h1>
      <div className="max-w-2xl mx-auto">
        {/* Search Input */}
        <div className="flex gap-4 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter a search query (e.g., Clothing in jlegun)"
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={fetchBusinesses}
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Results Table */}
        {businesses.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Address</th>
                  <th className="py-3 px-4 text-left">Website</th>
                  <th className="py-3 px-4 text-left">Phone</th> {/* Ensure this column exists */}
                </tr>
              </thead>
              <tbody>
                {businesses.map((business, index) => (
                  <tr key={business.place_id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="py-3 px-4">{business.name}</td>
                    <td className="py-3 px-4">{business.address}</td>
                    <td className="py-3 px-4">
                      {business.website ? (
                        <a
                          href={business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {business.website}
                        </a>
                      ) : (
                        'Not available'
                      )}
                    </td>
                    <td className="py-3 px-4">{business.phone || 'Not available'}</td> {/* Ensure this cell exists */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;