export const getFullImageUrl = (imageUrl) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  
  if (!imageUrl) return 'https://placehold.co/600x400?text=No+Image';
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
  return `${apiUrl}${imageUrl}`;
};