import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Check, X, Clock, CheckCircle, DollarSign, Loader } from 'lucide-react';

const ArtistCommissions = () => {
    const { user } = useAuth();
    const [commissions, setCommissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [priceInput, setPriceInput] = useState({});

    useEffect(() => {
        fetchCommissions();
    }, [user]);

    const fetchCommissions = async () => {
        if (!user?.token) return;

        try {
            setLoading(true);
            const res = await fetch('/api/commissions/artist', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });

            if (!res.ok) {
                throw new Error('Failed to fetch commissions');
            }

            const data = await res.json();
            setCommissions(data);
        } catch (err) {
            console.error('Error fetching commissions:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateCommission = async (commissionId, updates) => {
        try {
            setActionLoading(commissionId);
            const res = await fetch(`/api/commissions/${commissionId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(updates)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to update commission');
            }

            // Refresh commissions
            await fetchCommissions();
        } catch (err) {
            alert(err.message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleAccept = (commissionId) => {
        const price = priceInput[commissionId];
        if (!price || price <= 0) {
            alert('Please enter a valid price before accepting');
            return;
        }
        updateCommission(commissionId, { status: 'accepted', price: parseFloat(price) });
    };

    const handleReject = (commissionId) => {
        if (window.confirm('Are you sure you want to reject this commission?')) {
            updateCommission(commissionId, { status: 'rejected' });
        }
    };

    const handleComplete = (commissionId) => {
        updateCommission(commissionId, { status: 'completed' });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#f59e0b';
            case 'accepted': return '#22c55e';
            case 'completed': return '#3b82f6';
            case 'rejected': return '#ef4444';
            default: return 'gray';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock size={14} />;
            case 'accepted': return <Check size={14} />;
            case 'completed': return <CheckCircle size={14} />;
            case 'rejected': return <X size={14} />;
            default: return null;
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '200px', minHeight: '100vh' }}>
                <Loader size={48} className="animate-spin" />
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '120px', paddingBottom: '60px' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: '800' }}>
                Commission <span className="text-gradient">Requests</span>
            </h1>

            {error && (
                <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderColor: '#ef4444' }}>
                    {error}
                </div>
            )}

            {commissions.length === 0 ? (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                    <Clock size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <h3>No commission requests yet</h3>
                    <p style={{ color: 'var(--color-text-muted)' }}>When visitors request commissions, they'll appear here.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {commissions.map((comm) => (
                        <div key={comm._id} className="glass-panel" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                        <strong style={{ fontSize: '1.1rem' }}>{comm.requester?.username || 'Unknown'}</strong>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            background: `${getStatusColor(comm.status)}20`,
                                            color: getStatusColor(comm.status),
                                            fontSize: '0.8rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            {getStatusIcon(comm.status)}
                                            {comm.status}
                                        </span>
                                    </div>

                                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                                        {comm.brief}
                                    </p>

                                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                        {comm.deadline && (
                                            <span>📅 Deadline: {new Date(comm.deadline).toLocaleDateString()}</span>
                                        )}
                                        {comm.price && (
                                            <span>💰 Price: ${comm.price}</span>
                                        )}
                                        <span>📆 Requested: {new Date(comm.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                    {comm.status === 'pending' && (
                                        <>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <DollarSign size={16} />
                                                <input
                                                    type="number"
                                                    placeholder="Price"
                                                    value={priceInput[comm._id] || ''}
                                                    onChange={(e) => setPriceInput({ ...priceInput, [comm._id]: e.target.value })}
                                                    style={{
                                                        width: '80px',
                                                        padding: '8px',
                                                        background: 'rgba(0,0,0,0.3)',
                                                        border: '1px solid var(--glass-border)',
                                                        borderRadius: '6px',
                                                        color: 'white'
                                                    }}
                                                />
                                            </div>
                                            <button
                                                onClick={() => handleAccept(comm._id)}
                                                disabled={actionLoading === comm._id}
                                                style={{
                                                    padding: '8px 16px',
                                                    borderRadius: '6px',
                                                    background: '#22c55e',
                                                    color: 'white',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    opacity: actionLoading === comm._id ? 0.5 : 1
                                                }}
                                            >
                                                <Check size={16} /> Accept
                                            </button>
                                            <button
                                                onClick={() => handleReject(comm._id)}
                                                disabled={actionLoading === comm._id}
                                                style={{
                                                    padding: '8px 16px',
                                                    borderRadius: '6px',
                                                    background: '#ef4444',
                                                    color: 'white',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    opacity: actionLoading === comm._id ? 0.5 : 1
                                                }}
                                            >
                                                <X size={16} /> Reject
                                            </button>
                                        </>
                                    )}

                                    {comm.status === 'accepted' && (
                                        <button
                                            onClick={() => handleComplete(comm._id)}
                                            disabled={actionLoading === comm._id}
                                            style={{
                                                padding: '8px 16px',
                                                borderRadius: '6px',
                                                background: '#3b82f6',
                                                color: 'white',
                                                border: 'none',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                opacity: actionLoading === comm._id ? 0.5 : 1
                                            }}
                                        >
                                            <CheckCircle size={16} /> Mark Complete
                                        </button>
                                    )}

                                    {comm.status === 'completed' && (
                                        <span style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <CheckCircle size={16} /> Completed
                                        </span>
                                    )}

                                    {comm.status === 'rejected' && (
                                        <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <X size={16} /> Rejected
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ArtistCommissions;
