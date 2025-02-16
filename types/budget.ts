export interface Expense {
  id: number;
  name: string;
  categories: Category[];
}

export interface Category {
  id: number;
  name: string;
  expenseId: number;
  totals: {
    [key: string]: number;
  };
}

export interface Transactions {
  name: string;
  amount: number;
}
