export const calculateProcessorScore = (cores: number, threads: number): number => {
  if (!cores || !threads) return 0;
  // Weight: Cores 60%, Threads 40%
  // Assuming 24 cores / 32 threads as 10.0 scale relative (simple version)
  // Or just a direct calculation based on the formula used in mock data
  return Number(((cores * 0.6) + (threads * 0.4)).toFixed(1));
};

export const formatIDR = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
};
