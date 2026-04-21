/**
 * Photo Utilities — Shared helpers for photo category normalization.
 *
 * Purpose: Eliminates the 4x copy-pasted normalizeCategory() function
 * that was duplicated throughout PhotoUploadPage.tsx.
 *
 * FSD Layer: features/matching/utils
 */
import { UserPhoto } from '../../../shared/types/models';

/** Map of backend category names → frontend slot types */
const CATEGORY_MAP: Record<string, string> = {
  FACE: 'avatar',
  BODY: 'full_body',
  LIFESTYLE: 'lifestyle',
};

/**
 * Normalizes a backend photo category string to a frontend slot type.
 * Handles variations like 'FACE', 'BODY', 'CCCD_FRONT', etc.
 */
export const normalizePhotoCategory = (category: string): string => {
  if (!category) return '';
  const upper = category.toUpperCase();

  // Check direct match first (FACE, BODY, LIFESTYLE)
  if (CATEGORY_MAP[upper]) return CATEGORY_MAP[upper];

  // CCCD variants → id_card
  if (upper.includes('CCCD')) return 'id_card';

  return upper.toLowerCase();
};

/**
 * Filters photos to only include public-facing categories (excludes ID cards).
 */
export const filterPublicPhotos = (
  photos: UserPhoto[],
  activeTypes: string[]
): UserPhoto[] => {
  return photos.filter((p: UserPhoto) => {
    const cat = normalizePhotoCategory(p.category || p.type || '');
    return cat !== 'id_card' && !cat.includes('cccd') && activeTypes.includes(cat);
  });
};

/**
 * Maps frontend slot IDs to backend field names for form upload.
 */
export const getBackendPhotoKey = (slotId: string, slotType: string): string => {
  switch (slotId) {
    case 'id-front': return 'cccd_front';
    case 'id-back': return 'cccd_back';
    default:
      switch (slotType) {
        case 'avatar': return 'face';
        case 'full_body': return 'body';
        case 'lifestyle':
        case 'optional':
        default: return 'lifestyle';
      }
  }
};

/**
 * Type-to-slot ID mapping for restoring server photos to UI slots.
 */
export const TYPE_SLOT_MAP: Record<string, string[]> = {
  id_card: ['id-front', 'id-back'],
  avatar: ['av-1', 'av-2'],
  full_body: ['fb-1', 'fb-2'],
  lifestyle: ['ls-1', 'ls-2', 'op-1', 'op-2', 'op-3'],
};
