import type { Webcam, USState, WebcamCategory } from './webcam.types';

/**
 * Builds a webcam entry. The thumbnail is the live frame provided by YouTube,
 * so every card shows a real snapshot of the stream instead of a stock photo.
 */
const cam = (
  youtubeId: string,
  id: string,
  title: string,
  location: string,
  state: USState,
  category: WebcamCategory,
  source: string,
  description: string
): Webcam => ({
  id,
  title,
  location,
  state,
  country: 'United States',
  countryCode: 'US',
  category,
  thumbnailUrl: `https://i.ytimg.com/vi/${youtubeId}/hqdefault_live.jpg`,
  youtubeId,
  description,
  source,
  status: 'active',
});

// All streams below were verified as LIVE (not recordings) and embeddable.
export const INITIAL_WEBCAMS: Webcam[] = [
  // Wildlife & Sanctuaries
  cam('J7ZrIDvqlic', 'brooks-falls-bears', 'Brooks Falls Brown Bears', 'Katmai National Park', 'Alaska', 'wildlife', 'explore.org',
    'Wild brown bears fishing for sockeye salmon at Brooks Falls in Katmai National Park.'),
  cam('RhP-_jX8-Zs', 'anan-bear-lower-falls', 'Anan Bear Cam: Lower Falls & Caves', 'Anan Creek', 'Alaska', 'wildlife', 'explore.org',
    'Black and brown bears roaming the falls and caves of the Anan Wildlife Observatory.'),
  cam('vu7I315gQpU', 'katmai-underwater-salmon', 'Underwater Salmon Cam', 'Katmai National Park', 'Alaska', 'wildlife', 'explore.org',
    'An underwater view of sockeye salmon swimming upstream in the Brooks River.'),
  cam('GGIE1E-kaMQ', 'decorah-eagles-north', 'Decorah Eagles North Nest (4K)', 'Decorah', 'Iowa', 'wildlife', 'explore.org',
    'A 4K live view of a wild bald eagle nest high above the Iowa countryside.'),
  cam('5e4lsEe4Vew', 'wolf-center-north', 'International Wolf Center', 'Ely', 'Minnesota', 'wildlife', 'explore.org',
    'The ambassador wolf pack of the International Wolf Center in northern Minnesota.'),

  // Marine & Oceans
  cam('abbR-Ttd-cA', 'monterey-sea-otters', 'Monterey Bay Sea Otter Cam', 'Monterey', 'California', 'ocean', 'Monterey Bay Aquarium',
    'Rescued southern sea otters swimming, grooming and playing at Monterey Bay Aquarium.'),
  cam('w3LjpFhySTg', 'monterey-kelp-forest', 'Monterey Kelp Forest Cam', 'Monterey', 'California', 'ocean', 'Monterey Bay Aquarium',
    'A towering kelp forest filled with leopard sharks, rockfish and schools of sardines.'),
  cam('JH_NzhSsqis', 'catalina-marine-reserve', 'Catalina Marine Reserve', 'Catalina Island', 'California', 'ocean', 'explore.org',
    'Underwater life in the USC Wrigley Marine Reserve off Catalina Island.'),
  cam('uWiJ9qCYxoo', 'silver-springs-manatees', 'Silver Springs Underwater Manatee Cam', 'Silver Springs', 'Florida', 'ocean', 'explore.org',
    'A 180-degree underwater view of manatees in the crystal-clear Silver River.'),
  cam('Fz6sl9YJZE0', 'homosassa-manatees', 'Homosassa Springs Manatee Cam', 'Homosassa Springs', 'Florida', 'ocean', 'explore.org',
    'Watch gentle West Indian manatees glide through the spring waters of Homosassa.'),

  // Beaches & Coasts
  cam('fVa6-zCBR7A', 'monterey-bay-coast', 'Monterey Bay Coast Cam', 'Monterey', 'California', 'beach', 'Monterey Bay Aquarium',
    'Open view of Monterey Bay where wild sea lions, otters and whales are often spotted.'),
  cam('pXx3YQVSUGg', 'fort-lauderdale-beach', 'Fort Lauderdale Beach', 'Fort Lauderdale', 'Florida', 'beach', 'PTZtv',
    'Golden sands and Atlantic waves along the famous Fort Lauderdale beachfront.'),
  cam('iHJbTrQSZys', 'key-west-harbor', 'Key West Harbor', 'Key West', 'Florida', 'beach', 'PTZtv',
    'Boats, sailboats and tropical sunsets over the historic harbor of Key West.'),
  cam('OBgCrw-IyhE', 'seaside-heights', 'Seaside Heights Boardwalk', 'Seaside Heights', 'New Jersey', 'beach', 'EarthCam',
    'The classic Jersey Shore boardwalk and beach in Seaside Heights.'),

  // Parks & Nature
  cam('6tq8S2pp8PQ', 'pigeon-river', 'Pigeon River', 'Hartford', 'Tennessee', 'nature', 'EarthCam',
    'The rushing Pigeon River near the Great Smoky Mountains, a favorite for whitewater rafting.'),
  cam('zv67_HAFTOA', 'spirit-lake', 'Spirit Lake', 'Spirit Lake', 'Iowa', 'nature', 'EarthCam',
    'Peaceful views over Spirit Lake, the largest natural lake in Iowa.'),

  // City Skylines
  cam('o5Ie_LpZ9uk', 'statue-of-liberty', 'Statue of Liberty', 'New York City', 'New York', 'city', 'EarthCam',
    'A close live view of the Statue of Liberty in New York Harbor.'),
  cam('tErYxn2UM5Y', 'brooklyn-bridge', 'Brooklyn Bridge', 'New York City', 'New York', 'city', 'EarthCam',
    'The iconic Brooklyn Bridge with the Lower Manhattan skyline behind it.'),
  cam('xqdukYhcGEU', 'new-orleans-street', 'New Orleans Bourbon Street', 'New Orleans', 'Louisiana', 'city', 'EarthCam',
    'Street-level view of the lively French Quarter in New Orleans.'),
  cam('oDCAAfOSqvA', 'washington-monument', 'Washington Monument', 'Washington', 'District of Columbia', 'city', 'EarthCam',
    'The Washington Monument and the National Mall in the heart of the U.S. capital.'),
];
