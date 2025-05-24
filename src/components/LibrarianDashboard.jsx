import { useState, useEffect } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';

function LibrarianDashboard() {
  const { supabase } = useSupabase();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

//   const fetchRequests = async () => {
//     const { data } = await supabase
//       .from('book_requests')
//       .select('*, profiles(email)')
//       .order('created_at', { ascending: false });
//     setRequests(data || []);
// console.log('datadata',data);


//   };


const fetchRequests = async () => {
  try {
    // Step 1: Get all book requests
    const { data: requestsData, error: requestError } = await supabase
      .from('book_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (requestError) throw requestError;

    // Step 2: Extract user_ids from requests
    const userIds = [...new Set(requestsData.map(r => r.user_id))];

    // Step 3: Get user emails by IDs
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email')
      .in('id', userIds);

    if (profilesError) throw profilesError;

    // Step 4: Map user IDs to emails
    const emailMap = {};
    profilesData.forEach(profile => {
      emailMap[profile.id] = profile.email;
    });

    // Step 5: Merge email into each request
    const mergedData = requestsData.map(req => ({
      ...req,
      email: emailMap[req.user_id] || 'Unknown',
    }));

    setRequests(mergedData);
  } catch (err) {
    console.error('Fetch error:', err);
  }
};

  const handleStatusUpdate = async (requestId, status) => {
    const { error } = await supabase
      .from('book_requests')
      .update({ status })
      .eq('id', requestId);
    if (!error) fetchRequests();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Librarian Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Book Requests</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left p-2">Student Email</th>
              <th className="text-left p-2">Book Title</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td className="p-2">{request?.profiles?.email}</td>
                <td className="p-2">{request?.book_title}</td>
                <td className="p-2">{request?.status}</td>
                <td className="p-2">
                  {request.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(request.id, 'approved')}
                        className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(request.id, 'rejected')}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LibrarianDashboard;