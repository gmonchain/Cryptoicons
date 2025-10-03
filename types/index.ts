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

// This is an additional comment for the CryptoIcon interface.

// This is a placeholder comment for a commit.

/**
 * Represents a toast message with its properties.
 */
export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}