import { useState, useEffect } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';

function StudentDashboard() {
  const { supabase } = useSupabase();
  const [requests, setRequests] = useState([]);
  const [bookTitle, setBookTitle] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from('book_requests')
      .select('*')
      .eq('user_id', user.id);
    setRequests(data || []);
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('book_requests').insert({
      user_id: user.id,
      book_title: bookTitle,
      status: 'pending',
    });
    if (!error) {
      setBookTitle('');
      fetchRequests();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-bold mb-4">Request a Book</h2>
        <div>
          <div className="mb-4">
            <label className="block text-gray-700">Book Title</label>
            <input
              type="text"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <button
            onClick={handleRequest}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Submit Request
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Your Book Requests</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left p-2">Book Title</th>
              <th className="text-left p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td className="p-2">{request.book_title}</td>
                <td className="p-2">{request.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentDashboard;