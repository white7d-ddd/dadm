/**
 * Converts image URLs including Synology NAS share links (gofile.me or /sharing/)
 * into direct displayable image/download URLs that work seamlessly on static GitHub Pages
 * as well as full-stack Node server environments.
 */
export function convertSynologyToDirectUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  // If already a data URL, blob, or local path
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:') || trimmed.startsWith('/')) {
    return trimmed;
  }

  // Already converted to direct Synology download link
  if (trimmed.includes('/fbsharing/api/download')) {
    return trimmed;
  }

  // Handle gofile.me links: e.g. https://gofile.me/7X9a/AbCdEf
  if (trimmed.includes('gofile.me/')) {
    try {
      const parsed = new URL(trimmed);
      const parts = parsed.pathname.split('/').filter(Boolean);
      if (parts.length >= 2) {
        const serverId = parts[0];
        const shareId = parts[1].split('?')[0].split('#')[0];
        // Synology QuickConnect direct download URL format
        return `https://${serverId.toLowerCase()}.direct.quickconnect.to/fbsharing/api/download?id=${encodeURIComponent(shareId)}`;
      }
    } catch {
      // Fallback
    }
  }

  // Handle /sharing/ links: e.g. https://nas.mydomain.com:5001/sharing/AbCdEf or https://7x9a.quickconnect.to/sharing/AbCdEf
  if (trimmed.includes('/sharing/')) {
    try {
      const parsed = new URL(trimmed);
      const parts = parsed.pathname.split('/').filter(Boolean);
      const sharingIndex = parts.indexOf('sharing');
      if (sharingIndex !== -1 && parts[sharingIndex + 1]) {
        const shareId = parts[sharingIndex + 1].split('?')[0].split('#')[0];
        parsed.pathname = '/fbsharing/api/download';
        parsed.search = `?id=${encodeURIComponent(shareId)}`;
        return parsed.toString();
      }
    } catch {
      // Fallback
    }
  }

  return trimmed;
}

export function getDirectImageUrl(url: string): string {
  if (!url) return '';
  const cleanUrl = url.trim();

  if (cleanUrl.startsWith('/') || cleanUrl.startsWith('data:') || cleanUrl.startsWith('blob:')) {
    return cleanUrl;
  }

  // Convert Synology links to direct download links
  if (cleanUrl.includes('gofile.me/') || cleanUrl.includes('/sharing/')) {
    return convertSynologyToDirectUrl(cleanUrl);
  }

  return cleanUrl;
}


