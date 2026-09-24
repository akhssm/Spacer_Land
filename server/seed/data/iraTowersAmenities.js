// What each amenity shows when clicked. Wording follows the brochure:
// the club house facilities are from page 16, the feature lists from pages 7 and 18.

const gallery = (file, caption) => ({ url: `/projects/ira-towers/gallery/${file}.webp`, caption })

export const IRA_TOWERS_AMENITY_DETAILS = {
  'Club House': {
    description:
      'An 18,648 sq.ft club house at the south of the site, with the swimming pool on top. Everything below is inside it.',
    features: [
      'Banquet Hall',
      'Office Room',
      'Indoor Games',
      'Gym',
      'Coffee Shop',
      'Receptionist',
      'Salon',
      'Swimming Pool',
      'Co-Working Space',
      'Yoga',
      'Guest Rooms',
      'Spa',
      'Creche',
    ],
    images: [
      gallery('07-club-house', 'Club house'),
      gallery('01-elevation-clubhouse', 'Elevation with the club house'),
      gallery('03-aerial-pool', 'Swimming pool on the club house'),
      { url: '/projects/ira-towers/amenities/club-house-facilities.webp', caption: 'Club house facilities' },
    ],
  },
  'Swimming Pool': {
    description: 'Swimming pool on the club house, with a deck and sun loungers.',
    images: [gallery('03-aerial-pool', 'Swimming pool on the club house')],
  },
  "Children's Play Area": {
    description: 'Play area with slides, swings and climbing frames, beside the landscaped lawn on the east side.',
    features: ["Children's Play Area", 'Provision for Creche'],
    images: [gallery('08-play-area', "Children's play area")],
  },
  'Outdoor Games': {
    description:
      'Outdoor games along the north edge of the site: box cricket, badminton and the jogging track. Pictures are illustrative.',
    features: ['Box Cricket', 'Badminton', 'Jogging / Walking Track', 'Outdoor & Indoor Sports'],
    images: [
      // Pexels photo by aksinfo7 (Pexels licence: free for commercial use)
      gallery('13-box-cricket', 'Box cricket'),
      gallery('12-badminton', 'Badminton'),
      gallery('11-jogging-track', 'Jogging / walking track'),
    ],
  },
  'Sitting Area': {
    description: 'Planted sitting area beside the club house, on the walk in from the entrance.',
    features: ['Beautiful Landscaping'],
    images: [gallery('09-landscaped-walkway', 'Landscaped walkway')],
  },
  Lawn: {
    description: 'Central lawn between the blocks, the courtyard of the project.',
    features: ['Central Court Yard', 'Beautiful Landscaping'],
  },
  'Landscaped Lawn': {
    description: 'Landscaped green along the east boundary, with avenue plantation and the walking track.',
    features: ['Avenue Plantation', 'Beautiful Landscaping', 'Jogging / Walking Track', 'Rainwater Harvesting Pit'],
    images: [gallery('09-landscaped-walkway', 'Landscaped walkway')],
  },
  'Grand Entrance': {
    description: 'Grand entrance on the south side with a security post, leading to the club house and the blocks.',
    features: [
      'Grand Entry with Security Post',
      'Security Room',
      'Security under 24hr CCTV Surveillance',
      'Solar Power Fence',
      'EV Charging Points',
    ],
    images: [gallery('10-entrance-drive', 'Entrance drive'), gallery('05-night-view', 'Night view of the entrance')],
  },
}
