import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Playlist } from '../models/Playlist';
import { StoreType } from '../store/store';
import LockIcon from '@mui/icons-material/Lock';
import GroupIcon from '@mui/icons-material/Group';
import "./style/PlaylistList.css";

interface PlaylistListProps {
    playlists: Playlist[];
    onSelectPlaylist: (playlistId: number) => void;
    onClose: () => void;
}

const PlaylistList: React.FC<PlaylistListProps> = ({ playlists, onSelectPlaylist, onClose }) => {
    const user = useSelector((state: StoreType) => state.user.user);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [expandedPlaylist, setExpandedPlaylist] = useState<number | null>(null);

    // סינון פלייליסטים לפי חיפוש
    const filteredPlaylists = playlists.filter((playlist) =>
        playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // פונקציה להרחבת פלייליסט
    const handleExpand = (playlistId: number) => {
        setExpandedPlaylist(expandedPlaylist === playlistId ? null : playlistId);
    };

    // פונקציה לקביעת האייקון הנכון
    const getPlaylistIcon = (playlist: Playlist) => {
        return (playlist.sharedUsers && playlist.sharedUsers.length > 0) ? (
            <GroupIcon />
        ) : (
            <LockIcon />
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
                            <div className="playlist-info">
                                <span onClick={() => onSelectPlaylist(playlist.id)}>
                                    {playlist.name}
                                </span>
                                {getPlaylistIcon(playlist)}
                            </div>
                            <button onClick={() => handleExpand(playlist.id)}>
                                {expandedPlaylist === playlist.id ? 'הסתר שותפים' : 'הראה שותפים'}
                            </button>
                            {expandedPlaylist === playlist.id && (
                                <div className="playlist-shared-users">
                                    <p>בעלים: {playlist.owner ? playlist.owner.userName : 'לא זמין'}</p>
                                    <ul>
                                        {playlist.sharedUsers && playlist.sharedUsers.length > 0 ? (
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
            <button onClick={onClose} className="cancel-button">ביטול</button>
        </div>
    );
};

export default PlaylistList;
