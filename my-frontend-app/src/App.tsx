import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx'; // <-- Add this import

// Define the type for a business
interface Business {
  name: string;
  address: string;
  website: string | null;
  place_id: string;
  phone: string | null; // Ensure this field is defined
  email: string | null; // <-- Add this line
}

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('Enter your search here...');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const downloadExcel = () => {
    if (businesses.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(businesses);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Businesses');
    XLSX.writeFile(workbook, 'businesses.xlsx');
  };
  // Fetch businesses from the backend
  const fetchBusinesses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5021/businesses`, {
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
        <form
          className="flex gap-4 mb-8"
          onSubmit={(e) => {
            e.preventDefault();
            fetchBusinesses();
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter a search query (e.g., Clothing in ijegun)"
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Error Message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Results Table */}
        {businesses.length > 0 && (
          <div className="w-full mt-4">
            <div className="overflow-x-auto">
              <table className="w-full bg-white border border-gray-200 rounded-lg table-auto">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-2 text-left whitespace-nowrap">Name</th>
                    <th className="py-2 px-2 text-left whitespace-nowrap">Address</th>
                    <th className="py-2 px-2 text-left whitespace-nowrap">Website</th>
                    <th className="py-2 px-2 text-left whitespace-nowrap">Phone</th>
                    <th className="py-2 px-2 text-left whitespace-nowrap">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {businesses.map((business, index) => (
                    <tr key={business.place_id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="py-2 px-2 align-top">{business.name}</td>
                      <td className="py-2 px-2 align-top">{business.address}</td>
                      <td className="py-2 px-2 align-top">
                        {business.website ? (
                          <a
                            href={business.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline break-all"
                          >
                            {business.website}
                          </a>
                        ) : (
                          'Not available'
                        )}
                      </td>
                      <td className="py-2 px-2 align-top">{business.phone || 'Not available'}</td>
                      <td className="py-2 px-2 align-top break-all">{business.email || 'Not available'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Download Button */}
            <div className="flex justify-end mt-4">
              <button
                onClick={downloadExcel}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Download as Excel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;