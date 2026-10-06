// Clean up obsolete keys from previous projects while preserving CPTS keys
export const cleanupPreviousProjectStorage = () => {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      // If the key does not belong to the cpts project, mark it for removal
      if (key && !key.startsWith('cpts_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.warn('LocalStorage cleanup notice:', error);
  }
};
