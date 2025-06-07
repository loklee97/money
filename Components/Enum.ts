export type expenseCategory = {
  category: string,
  calculation: number,
  categoryCode: string,
}

export const expenseCategoryItem = [
  { category: 'Salary', calculation: 1, categoryCode: 'C-01' },
  { category: 'Water Bill', calculation: -1, categoryCode: 'C-02' },
  { category: 'Electric Bill', calculation: -1, categoryCode: 'C-03' },
  { category: 'Borrow to someone', calculation: -1, categoryCode: 'C-04' },
  { category: 'Food', calculation: -1, categoryCode: 'C-05' },
  { category: 'Return from borrow', calculation: 1, categoryCode: 'C-06' },
   { category: 'Others(+)', calculation: 1, categoryCode: 'C-07' },
    { category: 'Others(-)', calculation: -1, categoryCode: 'C-08' },
]

export type deleteRecordBody = {
  id: string,
  createdDate: string,
  userName : string,
  amount : number
}


export type pieData = {
  name: string | undefined,
  value: number,
  categoryCode: string,
  calculation : number | undefined,
}

export type HeaderProps = {
  money: number;
  user: string;
  logout: () => void;
  showMoney: boolean;
  setShowMoney: React.Dispatch<React.SetStateAction<boolean>>;
};

export const recordListColumn = [
  'createdDate',
  'amount',
  'name',
  'description',
  'balanced',
  'categoryCode',
]