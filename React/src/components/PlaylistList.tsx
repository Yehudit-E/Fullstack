import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Playlist } from '../models/Playlist';
import { StoreType } from '../store/store';
import LockIcon from '@mui/icons-material/Lock';
import GroupIcon from '@mui/icons-material/Group';
import "./style/PlaylistList.css"
interface PlaylistListProps {
    playlists: Playlist[];
    onSelectPlaylist: (playlistId: number) => void;
    onClose: () => void; // פונקציה שתסגור את החלון
}

const PlaylistList: React.FC<PlaylistListProps> = ({ playlists, onSelectPlaylist, onClose }) => {
    const user = useSelector((state: StoreType) => state.user.user); // בחר את המשתמש הנוכחי מ-RRedux
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [expandedPlaylist, setExpandedPlaylist] = useState<number | null>(null); // מנהל את הפלייליסט שהורחב
    // מסנן את הפלייליסטים לפי חיפוש
    const filteredPlaylists = playlists.filter((playlist) =>
        playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // פונקציה להרחבת הפלייליסט
    const handleExpand = (playlistId: number) => {
        setExpandedPlaylist(expandedPlaylist === playlistId ? null : playlistId);
    };

    // פונקציה שמחזירה את האיקון המתאים (מנעול או קבוצה)
    const getPlaylistIcon = (playlist: Playlist) => {
        // בדיקה אם SharedUsers קיים ולא undefined
        const sharedUsers = playlist.sharedUsers || [];
        return sharedUsers.length === 0 ? (
            <LockIcon /> // מנעול עבור פלייליסט פרטי
        ) : (
            <GroupIcon /> // קבוצה עבור פלייליסט משותף
        );
    };

    return (
        <div className="playlist-list-container">
            <input
                type="text"
                placeholder="חפש פלייליסטים..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />
            <div className="playlist-list">
                {filteredPlaylists.length === 0 ? (
                    <p>לא נמצאו פלייליסטים תואמים</p>
                ) : (
                    filteredPlaylists.map((playlist) => (
                        <div key={playlist.id} className="playlist-item">
                            <div className="playlist-info" onClick={() => onSelectPlaylist(playlist.id)}>
                                <span>{playlist.name}</span>
                                {getPlaylistIcon(playlist)}
                            </div>
                            <div>
                                <button onClick={() => handleExpand(playlist.id)}>
                                    {expandedPlaylist === playlist.id ? 'הסתר שותפים' : 'הראה שותפים'}
                                </button>
                                {expandedPlaylist === playlist.id && (
                                    <div>
                                        <p>בעלים: {playlist.owner ? playlist.owner.userName : 'לא זמין'}</p>
                                        <ul>
                                            {playlist.sharedUsers && playlist.sharedUsers.length > 0 ? (
                                                playlist.sharedUsers.map((user) => (
                                                    <li key={user.id}>{user.userName}</li>
                                                ))
                                            ) : (
                                                <li>לא שותף אף אחד</li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
            <button onClick={onClose} className="cancel-button">ביטול</button>
        </div>
    );
};

export default PlaylistList;
