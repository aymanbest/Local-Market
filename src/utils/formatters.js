export const formatPercentage = (value) => {
  if (typeof value !== 'number') return '0%';
  return `${Math.round(value * 100) / 100}%`;
};

export const formatCurrency = (value) => {
  if (typeof value !== 'number') return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}; 
