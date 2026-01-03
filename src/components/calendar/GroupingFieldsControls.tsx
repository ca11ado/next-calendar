import React from 'react';
import { GroupingField } from '@/lib/types';
import { GROUPING_FIELD_CONFIG } from '@/lib/constants';

interface GroupingFieldsControlsProps {
  selectedFields: GroupingField[];
  onToggleField: (field: GroupingField) => void;
}

const groupingFields: GroupingField[] = ['title', 'category'];

export function GroupingFieldsControls({
  selectedFields,
  onToggleField,
}: GroupingFieldsControlsProps) {
  return (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
      {groupingFields.map((field) => {
        const isSelected = selectedFields.includes(field);
        return (
          <button
            key={field}
            onClick={() => onToggleField(field)}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
              isSelected
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            aria-label={`Группировка по: ${GROUPING_FIELD_CONFIG[field].label}`}
            aria-pressed={isSelected}
          >
            {GROUPING_FIELD_CONFIG[field].label}
          </button>
        );
      })}
    </div>
  );
}
