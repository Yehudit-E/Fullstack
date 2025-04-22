import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Playlist } from '../models/Playlist';
import { StoreType } from '../store/store';
import { Song } from '../models/Song';
import LockIcon from '@mui/icons-material/Lock';
import GroupIcon from '@mui/icons-material/Group';
import PlaylistService from '../services/PlaylistService';
import SongService from '../services/SongService';

interface AddToPlaylistModalProps {
  song: Song;
  onClose: () => void;
}

const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({ song, onClose }) => {
  const user = useSelector((state: StoreType) => state.user.user);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedPlaylist, setExpandedPlaylist] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false); // חדש

  useEffect(() => {
    // נועלים גלילה
    document.body.style.overflow = 'hidden';
    setTimeout(() => setIsVisible(true), 10); // כדי לאפשר transition חלק

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const personal = await PlaylistService.getUserPlaylists(user.id);
        const shared = await PlaylistService.getUserSharedPlaylists(user.id);
        setPlaylists([...personal, ...shared]);
      } catch (error) {
        console.error('בעיה בשליפת הפלייליסטים:', error);
      }
    };

    if (user) fetchPlaylists();
  }, [user]);

  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExpand = (playlistId: number) => {
    setExpandedPlaylist(expandedPlaylist === playlistId ? null : playlistId);
  };

  const getPlaylistIcon = (playlist: Playlist) => {
    return playlist.sharedUsers && playlist.sharedUsers.length > 0 ? <GroupIcon /> : <LockIcon />;
  };

  const handleAddSong = async (playlistId: number) => {
    setLoading(true);
    try {
      await SongService.addSong({
        name: song.name,
        artist: song.artist,
        description: song.description,
        genre: song.genre,
        audioFilePath: song.audioFilePath,
        playlistId,
      });
      alert("השיר נוסף בהצלחה!");
      handleClose();
    } catch (error) {
      console.error("שגיאה בהוספת השיר:", error);
      alert("אירעה שגיאה בעת הוספת השיר.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300); // המתנה לסיום האנימציה
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 9000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        direction: 'rtl',
        fontSize: '16px',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
    >
      <div style={{
        backgroundColor: 'var(--color-gray)',
        color: 'var(--color-white)',
        borderRadius: '32px',
        padding: '16px',
        width: '600px',
        height: '450px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
        transition: 'transform 0.3s ease'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '12px'
        }}>הוספה לפלייליסט</h2>

        <input
          type="text"
          placeholder="חפש פלייליסטים..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '32px',
            border: '1px solid var(--color-black)',
            marginBottom: '12px',
            backgroundColor: 'var(--color-gray)',
            color: 'white',
            fontSize: '16px'
          }}
        />

        <div style={{
          flex: 1,
          overflowY: 'auto',
          paddingRight: '5px'
        }}>
          {filteredPlaylists.length === 0 ? (
            <p style={{ textAlign: 'center' }}>לא נמצאו פלייליסטים תואמים</p>
          ) : (
            filteredPlaylists.map((playlist) => (
              <div key={playlist.id} style={{
                backgroundColor: '#333',
                padding: '10px',
                borderRadius: '32px',
                marginBottom: '12px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {getPlaylistIcon(playlist)}
                    <span style={{ fontSize: '17px' }}>{playlist.name}</span>
                    <button
                      onClick={() => handleExpand(playlist.id)}
                      style={{
                        backgroundColor: '#333',
                        color: '#888',
                        padding: '8px 14px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '15px'
                      }}
                    >
                      {expandedPlaylist === playlist.id ? ' < הסתר' : ' > הצג פרטים נוספים'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleAddSong(playlist.id)}
                      disabled={loading}
                      style={{
                        background: 'linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))',
                        color: 'white',
                        padding: '8px 14px',
                        borderRadius: '32px',
                        border: 'none',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        width: '120px',
                        fontSize: '15px',
                        backgroundBlendMode: 'overlay',
                      }}
                    >
                      הוסף
                    </button>
                  </div>
                </div>

                {expandedPlaylist === playlist.id && (
                  <div style={{ marginTop: '8px', fontSize: '15px' }}>
                    <p>בעלים: {playlist.owner?.userName || 'לא זמין'}</p>
                    <ul style={{ margin: 0, paddingRight: '18px' }}>
                      {playlist.sharedUsers?.length > 0 ? (
                        playlist.sharedUsers.map((sharedUser) => (
                          <li key={sharedUser.id}>{sharedUser.userName}</li>
                        ))
                      ) : (
                        <li>לא שותף אף אחד</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div style={{ marginTop: '12px', textAlign: 'center' }}>
          <button
            onClick={handleClose}
            style={{
              background: 'linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))',
              padding: '0.5px',
              borderRadius: '32px',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            <span style={{
              color: 'white',
              backgroundColor: 'var(--color-gray)',
              borderRadius: '32px',
              padding: '10px 20px',
              display: 'inline-block'
            }}>ביטול</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToPlaylistModal;
