import { Routes, Route, Navigate } from 'react-router-dom';
import { useSupabase } from './contexts/SupabaseContext';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import LibrarianDashboard from './components/LibrarianDashboard';
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const { supabase } = useSupabase();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('App fetchUser:', user); // Debug
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        console.log('App profile:', data, error); // Debug
        setUser(user);
        setRole(data?.role || null);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    };

    fetchUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event, session); // Debug
      if (event === 'SIGNED_IN') {
        fetchUser();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setRole(null);
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/student"
        element={user && role === 'student' ? <StudentDashboard /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/librarian"
        element={user && role === 'librarian' ? <LibrarianDashboard /> : <Navigate to="/login" replace />}
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
