import { useMemo } from 'react';
import type { NPVInputs } from '../types';
import { calculateFinancial } from '../utils/financial';
export function useCalculations(inputs: NPVInputs) {
  return useMemo(() => calculateFinancial(inputs), [inputs]);
}
