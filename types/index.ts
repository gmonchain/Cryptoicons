/**
 * Represents a cryptocurrency icon with its metadata.
 */
export interface CryptoIcon {
  name: string;
  fileName: string;
  path: string;
  displayName: string;
  symbol?: string;
}

// This is a placeholder comment for a commit.

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}