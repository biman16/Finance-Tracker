export const formatAmount = (amount, currency) => {
  if (!currency) return `${amount}`;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.code
  }).format(amount);
};