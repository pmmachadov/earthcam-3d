export type WebcamCategory =
  | 'city'
  | 'nature'
  | 'beach'
  | 'traffic'
  | 'landmark'
  | 'airport';

export interface Webcam {
  id: string;
  title: string;
  city: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  category: WebcamCategory;
  thumbnailUrl: string;
  playerUrl: string;
  status: 'active' | 'offline';
  viewsCount?: number;
}

export interface WebcamFilter {
  searchTerm: string;
  category: WebcamCategory | 'all';
  onlyFavorites: boolean;
}
