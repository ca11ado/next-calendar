import React from 'react';
import { Button } from '@/components/ui/Button';

interface ColorRefreshButtonProps {
  onRefresh: () => void;
  iconOnly?: boolean;
}

export function ColorRefreshButton({
  onRefresh,
  iconOnly = false,
}: ColorRefreshButtonProps) {
  return (
    <Button
      onClick={onRefresh}
      size="md"
      variant="secondary"
      title="Перегенерировать цветовую палитру"
      className={
        iconOnly ? 'p-2' : 'inline-flex items-center whitespace-nowrap'
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`w-5 h-5 ${!iconOnly ? 'mr-1.5' : ''} flex-shrink-0`}
      >
        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
      </svg>
      {!iconOnly && <span className="flex-shrink-0">Цвета</span>}
    </Button>
  );
}
