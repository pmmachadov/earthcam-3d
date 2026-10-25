export type USState =
  | 'California'
  | 'Alaska'
  | 'Iowa'
  | 'Florida'
  | 'Hawaii';

export type WebcamCategory =
  | 'wildlife'
  | 'beach'
  | 'ocean'
  | 'nature';

export interface Webcam {
  id: string;
  title: string;
  location: string;
  state: USState;
  country: string;
  countryCode: string;
  category: WebcamCategory;
  thumbnailUrl: string;
  youtubeId: string;
  description: string;
  status: 'active' | 'offline';
  viewsCount?: number;
}
