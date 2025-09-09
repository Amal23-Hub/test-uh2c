/**
 * Safe clipboard utility that handles browsers that don't support the clipboard API
 */

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Check if the clipboard API is available
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers or non-secure contexts
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
      } catch (err) {
        document.body.removeChild(textArea);
        return false;
      }
    }
  } catch (err) {
    console.warn('Copy to clipboard failed:', err);
    return false;
  }
}

export function isClipboardSupported(): boolean {
  return !!(navigator.clipboard && window.isSecureContext) || 
         (document.queryCommandSupported && document.queryCommandSupported('copy'));
} 