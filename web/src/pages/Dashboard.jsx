import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchTickets = async () => {
    try {
      const res = await api.get('/tickets');
      setTickets(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Could not load tickets');
      }
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tickets', { subject, description });
      setSubject('');
      setDescription('');
      fetchTickets();
    } catch (err) {
      setError('Could not create ticket');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/tickets/${id}`, { status });
      fetchTickets();
    } catch (err) {
      setError('Could not update ticket');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const statusColors = {
    open: 'bg-blue-100 text-blue-700',
    'in-progress': 'bg-yellow-100 text-yellow-700',
    resolved: 'bg-green-100 text-green-700',
    escalated: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">HelpDesk AI</h1>
        <button onClick={logout} className="text-sm text-gray-600 hover:text-red-600">
          Log out
        </button>
      </header>

      <main className="max-w-3xl mx-auto p-6">
        {error && <p className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</p>}

        <form onSubmit={handleCreate} className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Raise a new ticket</h2>
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border p-2 rounded mb-3"
            required
          />
          <textarea
            placeholder="Describe your issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded mb-3"
            rows="3"
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Submit ticket
          </button>
        </form>

        <h2 className="text-lg font-semibold mb-4">All tickets ({tickets.length})</h2>
        {tickets.length === 0 ? (
          <p className="text-gray-500">No tickets yet. Create one above!</p>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket._id} className="bg-white p-4 rounded-xl shadow">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">{ticket.subject}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${statusColors[ticket.status]}`}>
                    {ticket.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1">{ticket.description}</p>

                {ticket.aiReply && (
                  <div className="mt-3 bg-purple-50 border-l-4 border-purple-400 p-3 rounded">
                    <p className="text-xs font-semibold text-purple-700 mb-1">🤖 AI Assistant</p>
                    <p className="text-sm text-gray-700">{ticket.aiReply}</p>
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  <button onClick={() => updateStatus(ticket._id, 'in-progress')} className="text-xs border px-2 py-1 rounded hover:bg-gray-50">
                    In progress
                  </button>
                  <button onClick={() => updateStatus(ticket._id, 'resolved')} className="text-xs border px-2 py-1 rounded hover:bg-gray-50">
                    Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;