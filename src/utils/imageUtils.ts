/**
 * Converts image URLs including Synology NAS share links (gofile.me or /sharing/)
 * into direct displayable image URLs via our backend proxy.
 */
export function getDirectImageUrl(url: string): string {
  if (!url) return '';
  
  const cleanUrl = url.trim();
  
  // If it's already a relative path, data URL, or blob URL, return as is
  if (cleanUrl.startsWith('/') || cleanUrl.startsWith('data:') || cleanUrl.startsWith('blob:')) {
    return cleanUrl;
  }

  // If it's a Synology NAS share link (gofile.me or /sharing/)
  if (cleanUrl.includes('gofile.me/') || cleanUrl.includes('/sharing/')) {
    return `/api/synology-proxy?url=${encodeURIComponent(cleanUrl)}`;
  }
  
  return cleanUrl;
}

