/**
 * Template-based logo builder definitions.
 * Each template is an SVG shape that accepts a colour, icon, and text overlay.
 */

export interface LogoTemplate {
  id: string;
  name: string;
  /** SVG viewBox dimensions */
  viewBox: string;
  /** Function that returns SVG path/shape content (no <svg> wrapper) */
  renderShape: (fill: string) => string;
}

export interface LogoPalette {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  text: string;
}

export interface LogoIcon {
  id: string;
  label: string;
  /** Lucide icon name */
  icon: string;
}

export interface LogoConfig {
  templateId: string;
  paletteId: string;
  iconId: string;
  businessName: string;
  fontSize: number;
}

// ─── Templates ──────────────────────────────────────────

export const LOGO_TEMPLATES: LogoTemplate[] = [
  {
    id: 'circle',
    name: 'Circle',
    viewBox: '0 0 200 200',
    renderShape: (fill) => `<circle cx="100" cy="100" r="95" fill="${fill}" />`,
  },
  {
    id: 'rounded-square',
    name: 'Rounded Square',
    viewBox: '0 0 200 200',
    renderShape: (fill) => `<rect x="5" y="5" width="190" height="190" rx="30" fill="${fill}" />`,
  },
  {
    id: 'shield',
    name: 'Shield',
    viewBox: '0 0 200 240',
    renderShape: (fill) =>
      `<path d="M100 5 L190 40 L190 140 Q190 200 100 235 Q10 200 10 140 L10 40 Z" fill="${fill}" />`,
  },
  {
    id: 'hexagon',
    name: 'Hexagon',
    viewBox: '0 0 200 230',
    renderShape: (fill) =>
      `<polygon points="100,5 190,60 190,170 100,225 10,170 10,60" fill="${fill}" />`,
  },
  {
    id: 'badge',
    name: 'Badge',
    viewBox: '0 0 200 220',
    renderShape: (fill) =>
      `<path d="M100 5 L130 15 L160 5 L175 30 L195 50 L185 80 L195 110 L175 130 L160 155 L130 145 L100 165 L70 145 L40 155 L25 130 L5 110 L15 80 L5 50 L25 30 L40 5 L70 15 Z" fill="${fill}" />`,
  },
  {
    id: 'banner',
    name: 'Banner',
    viewBox: '0 0 260 160',
    renderShape: (fill) =>
      `<path d="M0 20 L20 0 L240 0 L260 20 L260 140 L240 160 L20 160 L0 140 Z" fill="${fill}" />`,
  },
  {
    id: 'diamond',
    name: 'Diamond',
    viewBox: '0 0 200 200',
    renderShape: (fill) =>
      `<polygon points="100,5 195,100 100,195 5,100" fill="${fill}" />`,
  },
  {
    id: 'oval',
    name: 'Oval',
    viewBox: '0 0 240 180',
    renderShape: (fill) => `<ellipse cx="120" cy="90" rx="115" ry="85" fill="${fill}" />`,
  },
];

// ─── Colour Palettes ────────────────────────────────────

export const LOGO_PALETTES: LogoPalette[] = [
  { id: 'emerald', name: 'Emerald', primary: '#059669', secondary: '#d1fae5', text: '#ffffff' },
  { id: 'blue', name: 'Ocean Blue', primary: '#2563eb', secondary: '#dbeafe', text: '#ffffff' },
  { id: 'purple', name: 'Royal Purple', primary: '#7c3aed', secondary: '#ede9fe', text: '#ffffff' },
  { id: 'rose', name: 'Rose', primary: '#e11d48', secondary: '#ffe4e6', text: '#ffffff' },
  { id: 'amber', name: 'Amber', primary: '#d97706', secondary: '#fef3c7', text: '#ffffff' },
  { id: 'teal', name: 'Teal', primary: '#0d9488', secondary: '#ccfbf1', text: '#ffffff' },
  { id: 'indigo', name: 'Indigo', primary: '#4f46e5', secondary: '#e0e7ff', text: '#ffffff' },
  { id: 'slate', name: 'Slate', primary: '#334155', secondary: '#f1f5f9', text: '#ffffff' },
  { id: 'orange', name: 'Sunset', primary: '#ea580c', secondary: '#ffedd5', text: '#ffffff' },
  { id: 'sky', name: 'Sky', primary: '#0284c7', secondary: '#e0f2fe', text: '#ffffff' },
];

// ─── Icons (Lucide names) ───────────────────────────────

export const LOGO_ICONS: LogoIcon[] = [
  { id: 'rocket', label: 'Rocket', icon: 'Rocket' },
  { id: 'lightbulb', label: 'Idea', icon: 'Lightbulb' },
  { id: 'star', label: 'Star', icon: 'Star' },
  { id: 'heart', label: 'Heart', icon: 'Heart' },
  { id: 'zap', label: 'Energy', icon: 'Zap' },
  { id: 'award', label: 'Award', icon: 'Award' },
  { id: 'shopping-bag', label: 'Shop', icon: 'ShoppingBag' },
  { id: 'utensils', label: 'Food', icon: 'Utensils' },
  { id: 'paint-bucket', label: 'Creative', icon: 'Paintbrush' },
  { id: 'music', label: 'Music', icon: 'Music' },
  { id: 'camera', label: 'Photo', icon: 'Camera' },
  { id: 'code', label: 'Tech', icon: 'Code' },
  { id: 'leaf', label: 'Nature', icon: 'Leaf' },
  { id: 'book-open', label: 'Education', icon: 'BookOpen' },
  { id: 'sparkles', label: 'Magic', icon: 'Sparkles' },
  { id: 'wrench', label: 'Build', icon: 'Wrench' },
  { id: 'globe', label: 'Global', icon: 'Globe' },
  { id: 'crown', label: 'Premium', icon: 'Crown' },
  { id: 'trending-up', label: 'Growth', icon: 'TrendingUp' },
  { id: 'gift', label: 'Gift', icon: 'Gift' },
];

/** Helper: Get template by ID */
export function getTemplate(id: string) {
  return LOGO_TEMPLATES.find((t) => t.id === id) ?? LOGO_TEMPLATES[0];
}

/** Helper: Get palette by ID */
export function getPalette(id: string) {
  return LOGO_PALETTES.find((p) => p.id === id) ?? LOGO_PALETTES[0];
}

/** Helper: Get icon by ID */
export function getIcon(id: string) {
  return LOGO_ICONS.find((i) => i.id === id) ?? LOGO_ICONS[0];
}
