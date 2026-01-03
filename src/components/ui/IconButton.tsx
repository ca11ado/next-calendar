import React from 'react';

export type IconButtonVariant = 'neutral' | 'accent' | 'warning' | 'danger';
export type IconButtonSize = 'compact' | 'wide' | 'full';

interface IconButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  title: string;
  text?: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  disabled?: boolean;
  className?: string;
}

/**
 * Универсальная кнопка с иконкой для sidebar
 * Поддерживает разные варианты акцента, размеры и опциональный текст
 */
export function IconButton({
  icon,
  onClick,
  title,
  text,
  variant = 'neutral',
  size = 'compact',
  disabled = false,
  className = '',
}: IconButtonProps) {
  // Стили для вариантов
  const variantStyles: Record<IconButtonVariant, string> = {
    neutral: 'bg-gray-200 hover:bg-gray-300 text-gray-700',
    accent: 'bg-blue-600 hover:bg-blue-700 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  // Стили для размеров
  const sizeStyles: Record<IconButtonSize, string> = {
    compact: 'p-2', // квадратная компактная кнопка
    wide: 'px-4 py-2', // немного шире
    full: 'w-full px-4 py-2', // на всю ширину
  };

  // Базовые стили
  const baseStyles =
    'flex items-center justify-center rounded-lg transition-colors';

  // Стили для disabled состояния
  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer';

  // Flex класс в зависимости от того, есть ли текст
  const flexClass = text ? 'gap-2' : '';

  // Flex-1 для кнопки "Добавить" чтобы занимала больше места в ряду
  const flexGrowClass = size === 'wide' ? 'flex-1' : '';

  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${flexClass} ${flexGrowClass} ${className}`}
      aria-label={title}
    >
      {icon}
      {text && <span className="font-medium">{text}</span>}
    </button>
  );
}
