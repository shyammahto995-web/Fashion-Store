import { Order } from '../types';

export type TimeRangePreset = 'all' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface DateFilterOptions {
  preset: TimeRangePreset;
  customDate?: string; // YYYY-MM-DD for single day pick
  startDate?: string;  // YYYY-MM-DD
  endDate?: string;    // YYYY-MM-DD
}

/**
 * Filters orders according to the selected calendar timeframe
 */
export function filterOrdersByDate(orders: Order[], options: DateFilterOptions): Order[] {
  const { preset, customDate, startDate, endDate } = options;

  if (preset === 'all' && !startDate && !endDate && !customDate) {
    return orders;
  }

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  return orders.filter(order => {
    if (!order.createdAt) return false;
    const orderDate = new Date(order.createdAt);
    if (isNaN(orderDate.getTime())) return true;
    const orderDateStr = orderDate.toISOString().split('T')[0];

    if (preset === 'daily') {
      const targetDay = customDate || todayStr;
      return orderDateStr === targetDay;
    }

    if (preset === 'weekly') {
      // Last 7 days window (168 hours)
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      // Start of 7 days ago
      sevenDaysAgo.setHours(0, 0, 0, 0);
      return orderDate >= sevenDaysAgo;
    }

    if (preset === 'monthly') {
      // Either current calendar month or within last 30 days
      const isCurrentMonth = orderDate.getFullYear() === now.getFullYear() && orderDate.getMonth() === now.getMonth();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return isCurrentMonth || orderDate >= thirtyDaysAgo;
    }

    if (preset === 'yearly') {
      // Calendar year
      return orderDate.getFullYear() === now.getFullYear();
    }

    if (preset === 'custom') {
      if (startDate && endDate) {
        return orderDateStr >= startDate && orderDateStr <= endDate;
      }
      if (startDate) {
        return orderDateStr >= startDate;
      }
      if (endDate) {
        return orderDateStr <= endDate;
      }
      if (customDate) {
        return orderDateStr === customDate;
      }
    }

    return true;
  });
}

/**
 * Human readable label for active timeframe
 */
export function getTimeframeLabel(options: DateFilterOptions): string {
  const { preset, customDate, startDate, endDate } = options;
  const now = new Date();

  switch (preset) {
    case 'daily':
      return customDate 
        ? `Daily: ${customDate}` 
        : `Today (${now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })})`;
    case 'weekly':
      return 'Weekly (Last 7 Days)';
    case 'monthly':
      return `Monthly (${now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })})`;
    case 'yearly':
      return `Yearly (${now.getFullYear()})`;
    case 'custom':
      if (startDate && endDate) {
        return `Custom Range: ${startDate} to ${endDate}`;
      }
      if (startDate) return `From: ${startDate}`;
      if (endDate) return `Until: ${endDate}`;
      return 'Custom Range';
    case 'all':
    default:
      return 'All Time History';
  }
}
