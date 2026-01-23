/**
 * Card Style Configuration System
 * Matches the Flutter app's 5 card styles: Original, Cover, Classic, Pro, Minimal
 */

export type CardStyleType = 'original' | 'cover' | 'classic' | 'pro' | 'minimal';

export interface CardStyleConfig {
  styleType: CardStyleType;

  // Layout
  layoutAlignment: 'start' | 'center';
  contentPadding: string;
  tileSpacing: number;

  // Typography - Name
  nameFontSize: number;
  nameFontWeight: number;
  nameLetterSpacing: number;

  // Typography - Description
  descFontSize: number;
  descFontWeight: number;
  descLetterSpacing: number;
  descOpacity: number;

  // Typography - Bio
  bioFontSize: number;
  bioFontWeight: number;
  bioTopSpacing: number;

  // Tile styling
  tileBorderRadius: number;

  // Company logo
  companyLogoSize: number;
  companyLogoPosition: 'topRight' | 'coverBottomRight' | 'none';
  companyLogoBorderWidth: number;

  // Gradient overlay
  hasGradientOverlay: boolean;
  gradientType: 'dark' | 'background' | 'none';

  // Card container
  hasCardContainer: boolean;
  cardContainerRadius: number;

  // Owner info card
  hasOwnerInfoCard: boolean;

  // Circular profile photo
  hasCircularProfilePhoto: boolean;
  circularProfilePhotoSize: number;
  circularProfilePhotoBorderWidth: number;

  // Animation
  tileEntranceAnimation: 'slideUp' | 'fadeIn' | 'scaleIn' | 'none';
  tileStaggerDelayMs: number;

  // Cover height (percentage of viewport)
  coverHeightVh: number;
}

// Card style configurations matching Flutter app
export const cardStyleConfigs: Record<CardStyleType, CardStyleConfig> = {
  original: {
    styleType: 'original',
    layoutAlignment: 'start',
    contentPadding: '16px',
    tileSpacing: 6,
    nameFontSize: 28,
    nameFontWeight: 700,
    nameLetterSpacing: -1,
    descFontSize: 14,
    descFontWeight: 500,
    descLetterSpacing: -0.7,
    descOpacity: 1,
    bioFontSize: 12,
    bioFontWeight: 400,
    bioTopSpacing: 14,
    tileBorderRadius: 16,
    companyLogoSize: 50,
    companyLogoPosition: 'topRight',
    companyLogoBorderWidth: 0,
    hasGradientOverlay: true,
    gradientType: 'dark',
    hasCardContainer: true,
    cardContainerRadius: 20,
    hasOwnerInfoCard: false,
    hasCircularProfilePhoto: false,
    circularProfilePhotoSize: 0,
    circularProfilePhotoBorderWidth: 0,
    tileEntranceAnimation: 'slideUp',
    tileStaggerDelayMs: 35,
    coverHeightVh: 55,
  },

  cover: {
    styleType: 'cover',
    layoutAlignment: 'center',
    contentPadding: '16px',
    tileSpacing: 6,
    nameFontSize: 32,
    nameFontWeight: 700,
    nameLetterSpacing: -0.8,
    descFontSize: 13,
    descFontWeight: 400,
    descLetterSpacing: 0,
    descOpacity: 0.7,
    bioFontSize: 12,
    bioFontWeight: 400,
    bioTopSpacing: 16,
    tileBorderRadius: 16,
    companyLogoSize: 0,
    companyLogoPosition: 'none',
    companyLogoBorderWidth: 0,
    hasGradientOverlay: true,
    gradientType: 'background',
    hasCardContainer: false,
    cardContainerRadius: 0,
    hasOwnerInfoCard: false,
    hasCircularProfilePhoto: false,
    circularProfilePhotoSize: 0,
    circularProfilePhotoBorderWidth: 0,
    tileEntranceAnimation: 'slideUp',
    tileStaggerDelayMs: 35,
    coverHeightVh: 60,
  },

  classic: {
    styleType: 'classic',
    layoutAlignment: 'start',
    contentPadding: '16px',
    tileSpacing: 6,
    nameFontSize: 24,
    nameFontWeight: 740,
    nameLetterSpacing: -0.8,
    descFontSize: 14,
    descFontWeight: 500,
    descLetterSpacing: -0.7,
    descOpacity: 1,
    bioFontSize: 13,
    bioFontWeight: 420,
    bioTopSpacing: 12,
    tileBorderRadius: 10,
    companyLogoSize: 42,
    companyLogoPosition: 'topRight',
    companyLogoBorderWidth: 0,
    hasGradientOverlay: false,
    gradientType: 'none',
    hasCardContainer: false,
    cardContainerRadius: 0,
    hasOwnerInfoCard: true,
    hasCircularProfilePhoto: false,
    circularProfilePhotoSize: 0,
    circularProfilePhotoBorderWidth: 0,
    tileEntranceAnimation: 'slideUp',
    tileStaggerDelayMs: 35,
    coverHeightVh: 35,
  },

  pro: {
    styleType: 'pro',
    layoutAlignment: 'center',
    contentPadding: '16px',
    tileSpacing: 8,
    nameFontSize: 24,
    nameFontWeight: 740,
    nameLetterSpacing: -0.8,
    descFontSize: 14,
    descFontWeight: 500,
    descLetterSpacing: -0.7,
    descOpacity: 1,
    bioFontSize: 13,
    bioFontWeight: 420,
    bioTopSpacing: 12,
    tileBorderRadius: 10,
    companyLogoSize: 40,
    companyLogoPosition: 'coverBottomRight',
    companyLogoBorderWidth: 3,
    hasGradientOverlay: false,
    gradientType: 'none',
    hasCardContainer: false,
    cardContainerRadius: 0,
    hasOwnerInfoCard: true,
    hasCircularProfilePhoto: true,
    circularProfilePhotoSize: 130,
    circularProfilePhotoBorderWidth: 0,
    tileEntranceAnimation: 'slideUp',
    tileStaggerDelayMs: 35,
    coverHeightVh: 28,
  },

  minimal: {
    styleType: 'minimal',
    layoutAlignment: 'center',
    contentPadding: '16px',
    tileSpacing: 6,
    nameFontSize: 24,
    nameFontWeight: 740,
    nameLetterSpacing: -0.8,
    descFontSize: 14,
    descFontWeight: 500,
    descLetterSpacing: -0.7,
    descOpacity: 1,
    bioFontSize: 13,
    bioFontWeight: 420,
    bioTopSpacing: 20,
    tileBorderRadius: 18,
    companyLogoSize: 40,
    companyLogoPosition: 'coverBottomRight',
    companyLogoBorderWidth: 3,
    hasGradientOverlay: false,
    gradientType: 'none',
    hasCardContainer: false,
    cardContainerRadius: 0,
    hasOwnerInfoCard: true,
    hasCircularProfilePhoto: true,
    circularProfilePhotoSize: 130,
    circularProfilePhotoBorderWidth: 0,
    tileEntranceAnimation: 'none',
    tileStaggerDelayMs: 0,
    coverHeightVh: 0, // No cover, just profile photo
  },
};

/**
 * Parse card style type from string (supports backward compatibility)
 */
export function parseCardStyleType(value: string | undefined | null): CardStyleType {
  if (!value) return 'original';

  const normalized = value.toLowerCase();

  switch (normalized) {
    // New names
    case 'original': return 'original';
    case 'cover': return 'cover';
    case 'classic': return 'classic';
    case 'pro': return 'pro';
    case 'minimal': return 'minimal';
    // Old names (backward compatibility)
    case 'basic': return 'original';
    case 'gradient': return 'cover';
    case 'bold': return 'pro';
    case 'minimalist': return 'minimal';
    // Default
    default: return 'original';
  }
}

/**
 * Get style configuration for a card style type
 */
export function getStyleConfig(styleType: CardStyleType): CardStyleConfig {
  return cardStyleConfigs[styleType];
}

/**
 * Check if style uses centered layout
 */
export function isCenteredStyle(styleType: CardStyleType): boolean {
  return styleType === 'cover' || styleType === 'pro' || styleType === 'minimal';
}

/**
 * Check if style has circular profile photo
 */
export function hasCircularPhoto(styleType: CardStyleType): boolean {
  return styleType === 'pro' || styleType === 'minimal';
}

/**
 * Check if style has owner info card
 */
export function hasInfoCard(styleType: CardStyleType): boolean {
  return styleType === 'classic' || styleType === 'pro' || styleType === 'minimal';
}

/**
 * Get stagger delay class for tile animation
 */
export function getStaggerClass(index: number, styleType: CardStyleType): string {
  const config = cardStyleConfigs[styleType];
  if (config.tileEntranceAnimation === 'none') return '';

  const staggerIndex = Math.min(index + 1, 10);
  return `stagger-${staggerIndex}`;
}

/**
 * Get animation class for tile
 */
export function getTileAnimationClass(styleType: CardStyleType): string {
  const config = cardStyleConfigs[styleType];

  switch (config.tileEntranceAnimation) {
    case 'slideUp': return 'animate-slide-up';
    case 'fadeIn': return 'animate-fade-in';
    case 'scaleIn': return 'animate-scale-in';
    case 'none': return '';
    default: return '';
  }
}
