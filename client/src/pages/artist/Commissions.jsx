import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Edit, Eye, Trash2 } from 'lucide-react';

const ArtistCommissions = () => {
    const { user } = useAuth();
    const [commissions, setCommissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch commissions logic here (mocked for now as backend data might be empty)
        const fetchCommissions = async () => {
            try {
                // const res = await fetch(\`http://localhost:5000/api/commissions/artist\`, { headers: { Authorization: \`Bearer \${user.token}\` }});
                // const data = await res.json();
                // setCommissions(data);

                // Mock data
                setCommissions([
                    { _id: '1', requester: { username: 'ClientAlpha' }, brief: 'Cyberpunk landscape', status: 'pending', deadline: '2023-12-31', price: 200 },
                    { _id: '2', requester: { username: 'ArtLover99' }, brief: 'Portrait of my cat', status: 'accepted', deadline: '2024-01-15', price: 150 },
                ]);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCommissions();
    }, [user]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'orange';
            case 'accepted': return '#22c55e';
            case 'completed': return '#3b82f6';
            case 'rejected': return '#ef4444';
            default: return 'gray';
        }
    };

    return (
        <div className="container">
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>My Commissions</h1>

            <div className="glass-panel" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Client</th>
                            <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Brief</th>
                            <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Deadline</th>
                            <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Price</th>
                            <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Status</th>
                            <th style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {commissions.map((comm) => (
                            <tr key={comm._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem' }}>{comm.requester.username}</td>
                                <td style={{ padding: '1rem' }}>{comm.brief}</td>
                                <td style={{ padding: '1rem' }}>{new Date(comm.deadline).toLocaleDateString()}</td>
                                <td style={{ padding: '1rem' }}>${comm.price || '-'}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        background: `${getStatusColor(comm.status)}20`,
                                        color: getStatusColor(comm.status),
                                        fontSize: '0.85rem'
                                    }}>
                                        {comm.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                    <button style={{ padding: '6px', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', color: 'white' }}>
                                        <Edit size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ArtistCommissions;
