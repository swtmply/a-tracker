export interface Expense {
  name: string;
  categories: Category[];
}

export interface Category {
  id: string;
  name: string;
  totals: {
    [key: string]: number;
  };
  transactions: Transactions;
}

export interface Transactions {
  [key: string]: {
    name: string;
    amount: number;
  }[];
}
