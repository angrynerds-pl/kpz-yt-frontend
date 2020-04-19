import { User } from '../user';

export interface PlaylistItem {
  id?: number;
  ytID: string;
  name?: string;
}

export interface Playlist {
  id?: number;
  user?: User;
  playlistItems: PlaylistItem[];
}
