import React, { useEffect, useState } from 'react';
import { useUser } from "../../context/UserContext";
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

interface Artist {  
    name: string;
    image: string;
}

export const Artists: React.FC = () => {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);
    const { email } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTopArtists = async () => {
            try {
                const res = await axiosInstance.get(`/spotify/getUserArtists`, {
                    params: { email }
                  });
                const data = await res.data;
                setArtists(data);
            } catch (err) {
                console.error("Failed to fetch top artists", err);
            } finally {
                setLoading(false);
            }
        };

        if (email) {
            fetchTopArtists();
        }
    }, [email]);

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                padding: '64px 0',
                backgroundColor: 'rgba(0,0,0,0.6)',
                borderRadius: '16px'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        border: '3px solid rgba(255,255,255,0.3)',
                        borderTop: '3px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto'
                    }} />
                    <p style={{ 
                        marginTop: '16px', 
                        color: 'white', 
                        fontWeight: '300',
                        fontSize: '1rem',
                        margin: '16px 0 0 0'
                    }}>
                        Loading your top artists...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ 
            padding: '32px',
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: '16px'
        }}>
            {/* Go Back Button */}
            <div style={{ textAlign: 'left', marginBottom: '16px' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.5)',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        transition: 'background 0.3s',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                    }}
                >
                    ← Go Back
                </button>
            </div>

            {/* Header Section */}
            <div style={{ 
                textAlign: 'center', 
                marginBottom: '32px'
            }}>
                <h2 style={{ 
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '2rem',
                    margin: '0 0 8px 0'
                }}>
                    Your Top Artists
                </h2>
                <p style={{ 
                    color: 'rgba(255,255,255,0.8)',
                    fontWeight: '300',
                    fontSize: '1rem',
                    margin: '0'
                }}>
                    Based on your listening history
                </p>
            </div>

            {/* Artists Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '20px',
                padding: '8px'
            }}>
                {artists.map((artist, index) => (
                    <div
                        key={index}
                        style={{
                            position: 'relative',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            height: 'fit-content'
                        }}
                        onMouseEnter={(e) => {
                            const target = e.currentTarget;
                            target.style.transform = 'translateY(-4px)';
                            target.style.background = 'rgba(255,255,255,0.15)';
                            target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
                            
                            const img = target.querySelector('.artist-image') as HTMLElement;
                            if (img) {
                                img.style.transform = 'scale(1.05)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            const target = e.currentTarget;
                            target.style.transform = 'translateY(0)';
                            target.style.background = 'rgba(255,255,255,0.1)';
                            target.style.boxShadow = 'none';
                            
                            const img = target.querySelector('.artist-image') as HTMLElement;
                            if (img) {
                                img.style.transform = 'scale(1)';
                            }
                        }}
                    >
                        {/* Rank Badge */}
                        <div style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            background: 'rgba(0,0,0,0.7)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '12px',
                            padding: '6px 10px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            color: 'white',
                            zIndex: 2,
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}>
                            #{index + 1}
                        </div>

                        {/* Artist Image */}
                        <div style={{ 
                            position: 'relative',
                            paddingTop: '100%',
                            overflow: 'hidden'
                        }}>
                            <img
                                className="artist-image"
                                src={artist.image}
                                alt={artist.name}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.3s ease'
                                }}
                            />
                            
                            {/* Subtle Gradient Overlay */}
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '40%',
                                background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                                pointerEvents: 'none'
                            }} />
                        </div>

                        {/* Artist Info */}
                        <div style={{ 
                            padding: '20px'
                        }}>
                            <h4 style={{ 
                                color: 'white',
                                fontWeight: '500',
                                fontSize: '1rem',
                                lineHeight: '1.3',
                                textAlign: 'center',
                                margin: '0',
                                textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                            }}>
                                {artist.name}
                            </h4>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            {artists.length > 0 && (
                <div style={{ 
                    textAlign: 'center', 
                    marginTop: '24px',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <p style={{ 
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '0.9rem',
                        margin: 0
                    }}>
                        {artists.length} favorite artists
                    </p>
                </div>
            )}

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @media (max-width: 1200px) {
                    div[style*="grid-template-columns: repeat(5, 1fr)"] {
                        grid-template-columns: repeat(4, 1fr) !important;
                    }
                }
                
                @media (max-width: 900px) {
                    div[style*="grid-template-columns: repeat(5, 1fr)"] {
                        grid-template-columns: repeat(3, 1fr) !important;
                    }
                }
                
                @media (max-width: 600px) {
                    div[style*="grid-template-columns: repeat(5, 1fr)"] {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }
                }
                
                @media (max-width: 400px) {
                    div[style*="grid-template-columns: repeat(5, 1fr)"] {
                        grid-template-columns: repeat(1, 1fr) !important;
                    }
                }
            `}</style>
        </div>
    );
};
