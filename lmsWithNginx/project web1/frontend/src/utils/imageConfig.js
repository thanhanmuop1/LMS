export const getImageUrl = (path) => {
    if (!path) return null;
    
    // Nếu là URL đầy đủ (https://...)
    if (path.startsWith('http')) {
      return path;
    }
    
    // Nếu là path relative
    return `${process.env.REACT_APP_API_URL}${path}`;
  };