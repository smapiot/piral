import { OAuth2Persistence } from './types';

/**
 * Creates an OAuth 2 persistence layer using memory.
 */
export function createOAuth2MemoryPersistence(): OAuth2Persistence {
  return {
    load() {
      return undefined;
    },
    save() {},
  };
}

/**
 * Creates an OAuth 2 persistence layer using sessionStorage.
 */
export function createOAuth2SessionPersistence(sessionKey = '$piral_oauth2_info'): OAuth2Persistence {
  return {
    load() {
      const content = sessionStorage.getItem(sessionKey);

      if (typeof content === 'string') {
        try {
          return JSON.parse(content);
        } catch {
          console.error('Found invalid data in the OAuth 2 session storage key. Skipped.');
        }
      }

      return undefined;
    },
    save(info) {
      sessionStorage.setItem(sessionKey, JSON.stringify(info));
    },
  };
}

/**
 * Creates an OAuth 2 persistence layer using localStorage.
 */
export function createOAuth2BrowserPersistence(localKey = '$piral_oauth2_info'): OAuth2Persistence {
  return {
    load() {
      const content = localStorage.getItem(localKey);

      if (typeof content === 'string') {
        try {
          return JSON.parse(content);
        } catch {
          console.error('Found invalid data in the OAuth 2 local storage key. Skipped.');
        }
      }

      return undefined;
    },
    save(info) {
      localStorage.setItem(localKey, JSON.stringify(info));
    },
  };
}
