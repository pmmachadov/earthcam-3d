export type USState =
  | 'Alaska'
  | 'California'
  | 'District of Columbia'
  | 'Florida'
  | 'Iowa'
  | 'Louisiana'
  | 'Minnesota'
  | 'New Jersey'
  | 'New York'
  | 'Tennessee';

export type WebcamCategory =
  | 'wildlife'
  | 'beach'
  | 'ocean'
  | 'nature'
  | 'city';

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
  /** Organization that operates the live stream (e.g. explore.org, EarthCam). */
  source: string;
  status: 'active' | 'offline';
  viewsCount?: number;
}
