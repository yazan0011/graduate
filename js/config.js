/**
 * ═══════════════════════════════════════════════════════════
 * GRADUATION EXPERIENCE — CONFIGURATION
 * Replace these values with your real details & assets.
 * ═══════════════════════════════════════════════════════════
 */

export const CONFIG = {
  graduates: [
    {
      id: 'graduate-1',
      name: 'AHMED',
      fullName: 'Ahmed Hassan',
      field: 'Computer Science',
      year: '2026',
      quote: 'Every ending is simply\nthe beginning of something new.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=1600&fit=crop&q=80',
    },
    {
      id: 'graduate-2',
      name: 'OMAR',
      fullName: 'Omar Khalil',
      field: 'Architecture',
      year: '2026',
      quote: 'Built from years of dreams.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&h=1600&fit=crop&q=80',
    },
    {
      id: 'graduate-3',
      name: 'ALI',
      fullName: 'Ali Rahman',
      field: 'Business Administration',
      year: '2026',
      quote: 'Made it. Together.',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&h=1600&fit=crop&q=80',
    },
  ],

  classOf: '2026',

  hero: {
    line1: 'ONE JOURNEY.',
    line2: 'THREE STORIES.',
    tagline: 'CLASS OF 2026',
  },

  event: {
    title: 'GRADUATION NIGHT',
    date: 'September 12, 2026',
    time: '7:00 PM',
    location: 'Grand Ballroom, City Hall',
    locationUrl: 'https://maps.google.com/?q=Grand+Ballroom+City+Hall',
    /** ISO datetime used by the countdown */
    datetime: '2026-09-12T19:00:00',
  },

  whatsapp: {
    /** Include country code, digits only — e.g. 15551234567 */
    number: '15551234567',
    message: "Hi! I'd love to join you for your graduation celebration 🎓",
  },

  journey: [
    { year: '2019', title: 'FIRST DAY', caption: 'Where everything began.' },
    { year: '2020', title: 'FIRST CHALLENGE', caption: 'We learned to endure.' },
    { year: '2022', title: 'COUNTLESS MEMORIES', caption: 'Nights that shaped us.' },
    { year: '2025', title: 'THE FINAL YEAR', caption: 'One last climb together.' },
    { year: '2026', title: 'WE MADE IT', caption: 'The chapter closes. A new one opens.' },
  ],

  gallery: [
    {
      src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1000&q=80',
      caption: 'Campus mornings',
      size: 'large',
    },
    {
      src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
      caption: 'Late night studios',
      size: 'tall',
    },
    {
      src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c39?w=800&q=80',
      caption: 'Celebration',
      size: 'medium',
    },
    {
      src: 'https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?w=800&q=80',
      caption: 'Friends forever',
      size: 'wide',
    },
    {
      src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80',
      caption: 'Study sessions',
      size: 'medium',
    },
    {
      src: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1000&q=80',
      caption: 'Quiet libraries',
      size: 'tall',
    },
    {
      src: 'https://images.unsplash.com/photo-1462536943532-57a629f6cc60?w=800&q=80',
      caption: 'City walks',
      size: 'medium',
    },
    {
      src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
      caption: 'Lecture halls',
      size: 'wide',
    },
  ],

  finale: {
    line1: 'THE END OF ONE CHAPTER.',
    line2: 'THE BEGINNING OF EVERYTHING.',
  },

  rsvp: {
    headline: "WE'D LOVE TO HAVE YOU THERE.",
    subtext: 'Come celebrate this moment with us.',
    primary: 'CONFIRM YOUR PRESENCE',
    secondary: 'SEND US A MESSAGE',
  },
};

/** Convenience aliases matching the brief */
export const GRADUATE_1_NAME = CONFIG.graduates[0].name;
export const GRADUATE_1_IMAGE = CONFIG.graduates[0].image;
export const GRADUATE_1_FIELD = CONFIG.graduates[0].field;
export const GRADUATE_2_NAME = CONFIG.graduates[1].name;
export const GRADUATE_2_IMAGE = CONFIG.graduates[1].image;
export const GRADUATE_2_FIELD = CONFIG.graduates[1].field;
export const GRADUATE_3_NAME = CONFIG.graduates[2].name;
export const GRADUATE_3_IMAGE = CONFIG.graduates[2].image;
export const GRADUATE_3_FIELD = CONFIG.graduates[2].field;
export const EVENT_DATE = CONFIG.event.date;
export const EVENT_TIME = CONFIG.event.time;
export const EVENT_LOCATION = CONFIG.event.location;
export const WHATSAPP_NUMBER = CONFIG.whatsapp.number;
