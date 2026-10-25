export type USState =
  | 'California'
  | 'New York'
  | 'Florida'
  | 'Texas'
  | 'Washington'
  | 'Nevada';

export type WebcamCategory =
  | 'traffic'
  | 'city'
  | 'highway'
  | 'bridge'
  | 'beach';

export interface Webcam {
  id: string;
  title: string;
  city: string;
  state: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  category: WebcamCategory;
  thumbnailUrl: string;
  playerUrl: string; // Direct HLS (.m3u8) live stream
  status: 'active' | 'offline';
  viewsCount?: number;
}

export interface WebcamFilter {
  searchTerm: string;
  state: USState | 'all';
  category: WebcamCategory | 'all';
  onlyFavorites: boolean;
}
