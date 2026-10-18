import React from 'react';
import type { TripStop } from '../../types';
import { calculateTripBudget } from '../../services/trips';
import { DollarSign, PieChart } from 'lucide-react';
import { NeoCard } from '../ui/NeoCard';

interface BudgetSummaryProps {
  stops: TripStop[];
  currency?: string;
}

export const BudgetSummary: React.FC<BudgetSummaryProps> = ({
  stops,
  currency = 'INR'
}) => {
  const { total, byDay } = calculateTripBudget(stops);
  const dayKeys = Object.keys(byDay).map(Number).sort((a, b) => a - b);

  return (
    <NeoCard className="p-5 bg-[#FFFDF5] border-[2.5px] border-[#171717]">
      <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#171717]/15">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FFE600] border-2 border-[#171717] flex items-center justify-center shadow-[2px_2px_0_#171717]">
            <PieChart size={18} className="text-[#171717]" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 block">
              Expense Overview
            </span>
            <h4 className="font-black text-lg text-[#171717]">
              Trip Budget Estimator
            </h4>
          </div>
        </div>

        {/* Total Cost Display */}
        <div className="text-right">
          <span className="text-[10px] font-extrabold uppercase text-gray-500 block">Total Est. Cost</span>
          <span className="text-xl sm:text-2xl font-black text-[#171717] flex items-center gap-0.5 bg-[#D8FF3E] px-2.5 py-1 rounded border-2 border-[#171717] shadow-[2px_2px_0_#171717]">
            <DollarSign size={18} /> {currency} {total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Day by Day Breakdown */}
      {dayKeys.length === 0 ? (
        <p className="text-xs text-gray-500 font-semibold italic text-center py-2">
          No cost estimates added to stops yet. Add costs when adding places to see the breakdown.
        </p>
      ) : (
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
            Day-wise Breakdown
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {dayKeys.map(day => (
              <div
                key={day}
                className="bg-white p-2.5 rounded-lg border-1.5 border-[#171717] shadow-[1.5px_1.5px_0_#171717]"
              >
                <span className="text-[10px] font-extrabold uppercase text-gray-500 block">
                  Day {day}
                </span>
                <span className="text-sm font-black text-[#171717] block">
                  {currency} {byDay[day].toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </NeoCard>
  );
};
