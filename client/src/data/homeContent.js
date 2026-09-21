// All the text shown on the home page lives here.
// To change wording, edit this file. The components only handle layout.

import {
  ArrowLeftRight,
  Box,
  EyeOff,
  FileText,
  Images,
  Layers,
  Link2,
  LocateFixed,
  MapPin,
  MessageCircle,
  Navigation,
  Palette,
  Ruler,
  Satellite,
  Search,
  Smartphone,
  Table,
  Users,
} from 'lucide-react'

export const SITE = {
  name: 'PlotView',
  tagline: 'Your plot layout, live on the map',
  email: 'hello@example.com', // TODO: replace with your sales email
  whatsapp: '', // TODO: number with country code and no "+", e.g. 919876543210
}

export const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Requirements', href: '#requirements' },
  { label: 'FAQ', href: '#faq' },
]

// Plot statuses. The same keys will be used by the real viewer later.
export const STATUSES = [
  { key: 'available', label: 'Available' },
  { key: 'sold', label: 'Sold' },
  { key: 'hold', label: 'Hold' },
  { key: 'reserved', label: 'Reserved' },
]

export const HIGHLIGHTS = [
  {
    icon: Link2,
    title: 'One link, not ten files',
    text: 'Layout, brochure, photos, videos and location open from a single link you can send on WhatsApp.',
  },
  {
    icon: Table,
    title: 'Inventory that is always current',
    text: 'Mark a plot sold once. Everyone who opens the link sees the change straight away.',
  },
  {
    icon: MapPin,
    title: 'The layout on the real land',
    text: 'Buyers see your layout placed on the satellite map, so roads and surroundings make sense.',
  },
]

export const FEATURE_GROUPS = [
  {
    title: 'For your buyers',
    features: [
      { icon: Satellite, title: 'Satellite view', text: 'The layout drawn over the real site.' },
      { icon: Box, title: '2D and 3D', text: 'Switch between a flat plan and a tilted 3D view.' },
      { icon: LocateFixed, title: 'Live GPS', text: 'Shows where the buyer is standing on the site.' },
      { icon: Navigation, title: 'Directions', text: 'Opens the route to the site in Google Maps.' },
      { icon: Search, title: 'Plot search', text: 'Jump to any plot by its number.' },
      { icon: Ruler, title: 'Plot dimensions', text: 'Side lengths and area, even for odd-shaped plots.' },
      { icon: ArrowLeftRight, title: 'Unit switch', text: 'View areas in sq.ft, sq.yd or sq.m.' },
      { icon: Images, title: 'Gallery', text: 'Site photos and YouTube videos in one place.' },
      { icon: FileText, title: 'Brochure', text: 'Download the project brochure from the viewer.' },
      { icon: Smartphone, title: 'No app to install', text: 'Opens in the phone browser from a link.' },
    ],
  },
  {
    title: 'For your sales team',
    features: [
      { icon: Table, title: 'Inventory table', text: 'Update plot status in a spreadsheet-like screen.' },
      { icon: Palette, title: 'Status colours', text: 'Available, Sold, Hold and Reserved, in your colours.' },
      { icon: Layers, title: 'Zones', text: 'Group plots into phases or zones and filter by them.' },
      { icon: EyeOff, title: 'Public and internal links', text: 'Hide inventory status on the link you share publicly.' },
      { icon: MessageCircle, title: 'WhatsApp enquiry', text: 'Buyers enquire about a plot in one tap.' },
      { icon: Users, title: 'Lead list', text: 'Keep track of who enquired about which plot.' },
    ],
  },
]

export const STEPS = [
  {
    title: 'Send us your layout',
    text: 'Share the approved layout drawing, the site location and your branding.',
  },
  {
    title: 'We place it on the map',
    text: 'Every plot is traced, numbered and lined up with the satellite map.',
  },
  {
    title: 'Share one link',
    text: 'Send the link to buyers and brokers. Update plot status whenever a deal moves.',
  },
]

export const REQUIREMENTS = [
  {
    icon: FileText,
    title: 'Layout drawing',
    text: 'A CAD file or vector PDF is best. A clear image of the layout also works.',
  },
  {
    icon: MapPin,
    title: 'Site location',
    text: 'A Google Maps pin or link for the project site.',
  },
  {
    icon: Palette,
    title: 'Branding',
    text: 'Your logo, brand colours and the project name.',
  },
]

export const FAQS = [
  {
    question: 'Do buyers need to install an app?',
    answer: 'No. The viewer opens in the browser on any phone or computer, straight from the link.',
  },
  {
    question: 'Which kinds of projects does it support?',
    answer:
      'Plotted projects: residential, commercial and industrial plots, farmhouses, villas and row houses. It is not made for apartments.',
  },
  {
    question: 'Does it design the layout for me?',
    answer: 'No. It shows a layout you already have. We do not create or change the layout design.',
  },
  {
    question: 'Who updates the plot status?',
    answer:
      'Your own team. The admin screen works like a spreadsheet, and changes appear on the link immediately.',
  },
  {
    question: 'Can I hide which plots are sold?',
    answer:
      'Yes. Each project has an internal link that shows status and a public link that hides it.',
  },
  {
    question: 'My plots are not rectangles. Will areas still be right?',
    answer:
      'Yes. Areas and side lengths are calculated from the actual plot shape, so corner, curved and triangular plots work.',
  },
]

// Where the "Book a demo" buttons go: WhatsApp if a number is set, email otherwise.
export function getContactLink() {
  const message = `Hi, I would like a demo of ${SITE.name}.`

  if (SITE.whatsapp) {
    return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`
  }
  return `mailto:${SITE.email}?subject=${encodeURIComponent(`${SITE.name} demo`)}`
}
