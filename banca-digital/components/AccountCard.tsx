import React from 'react';

interface Account {
  id: string;
  name: string;
  balance: number;
}

interface AccountCardProps {
  account: Account;
  isSelected: boolean;
  onSelect: () => void;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, isSelected, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className={`p-6 border rounded-lg shadow-md transition-all cursor-pointer ${
        isSelected ? 'bg-green-50 border-green-500' : 'bg-white hover:shadow-lg'
      }`}
    >
      <h3 className="text-xl font-semibold text-green-700">{account.name}</h3>
      <p className="text-green-600">${account.balance.toFixed(2)}</p>
    </div>
  );
};

export default AccountCard;