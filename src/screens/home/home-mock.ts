import type { PixelIconName } from '../../components/pixel-icon';

export type RecentTransaction = {
  id: string;
  icon: PixelIconName;
  date: string;
  description: string;
  amount: number;
};

export const homeMock = {
  monthlyExpenses: 1250,
  generalTotal: 18790.5,
  transactions: [
    {
      id: '1',
      icon: 'coffee',
      date: '02 OUT',
      description: 'CAFÉ PADARIA',
      amount: 12.9,
    },
    {
      id: '2',
      icon: 'car',
      date: '01 OUT',
      description: 'UBER VIAGEM',
      amount: 34.5,
    },
    {
      id: '3',
      icon: 'shopping-cart',
      date: '30 SET',
      description: 'MERCADO EXTRA',
      amount: 215.8,
    },
  ] satisfies RecentTransaction[],
};

export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}
