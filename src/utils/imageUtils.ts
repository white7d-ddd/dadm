/**
 * Converts a standard Synology NAS file share link (gofile.me or /sharing/)
 * into a direct image stream/download URL so it can be loaded directly by <img> tags.
 */
export function getDirectImageUrl(url: string): string {
  if (!url) return '';
  
  const cleanUrl = url.trim();
  
  // 1. Synology gofile.me share link (e.g., https://gofile.me/6xKyz/abcdef)
  if (cleanUrl.includes('gofile.me/')) {
    if (cleanUrl.includes('dlink=true')) return cleanUrl;
    const connector = cleanUrl.includes('?') ? '&' : '?';
    return `${cleanUrl}${connector}dlink=true`;
  }
  
  // 2. Synology NAS standard /sharing/ link (e.g., https://nas.domain.com:5001/sharing/abcdef)
  if (cleanUrl.includes('/sharing/')) {
    if (cleanUrl.includes('/fbsharing/')) return cleanUrl;
    
    const parts = cleanUrl.split('/sharing/');
    if (parts.length === 2) {
      const base = parts[0];
      const id = parts[1].split('?')[0];
      return `${base}/fbsharing/api/download?id=${id}&dlink=true`;
    }
  }
  
  return cleanUrl;
}
