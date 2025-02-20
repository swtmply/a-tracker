export interface Expense {
  id: number;
  name: string;
  categories: Category[];
}

export interface Category {
  id: number;
  name: string;
  expenseId: number;
  transactions: Transactions[];
  totals: {
    [key: string]: number;
  };
}

export interface Transactions {
  name: string;
  amount: number;
  month: string;
  year: number;
}

export interface ExpenseWithCategories extends Expense {
  categories: Category[];
}
