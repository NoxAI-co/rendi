/**
 * Centralized financial calculations for rendi
 */

export type AccountType = 'SAVINGS' | 'CDT' | 'LOW_AMOUNT_DEPOSIT';

/**
 * Calculates the retention based on Colombian tax rules
 * @param interests Gross interests earned
 * @param type The type of account
 * @returns The amount to be retained
 */
export const calculateRetention = (interests: number, type: AccountType): number => {
  if (type === 'CDT') {
    // CDT has a fixed 4% retention regardless of amount
    return interests * 0.04;
  }

  // Savings accounts and Bajo Monto deposits
  const dailyThreshold = 2588.58; // Daily limit for retention in COP
  const monthlyThreshold = dailyThreshold * 30;

  if (interests > monthlyThreshold) {
    return interests * 0.07; // 7% retention for savings
  }

  return 0;
};

/**
 * Calculates returns for savings accounts (Compound interest calculation)
 */
export const calculateSavingsReturns = (amount: number, months: number, tasaEA: number) => {
  const EA = tasaEA / 100;
  const r = Math.pow(1 + EA, 1 / 12) - 1; // Monthly effective rate
  
  const A = amount * Math.pow(1 + r, months);
  const interests = A - amount;
  const retention = calculateRetention(interests, 'SAVINGS');
  const finalAmount = A - retention;

  // Monthly breakdown (1 month projection)
  const monthlyA = amount * Math.pow(1 + r, 1);
  const monthlyInterests = monthlyA - amount;
  const monthlyRetention = calculateRetention(monthlyInterests, 'SAVINGS');
  const finalAmountMonthly = monthlyA - monthlyRetention;

  return {
    interests,
    retention,
    finalAmount,
    interestsMonthly: monthlyInterests,
    retentionMonthly: monthlyRetention,
    finalAmountMonthly
  };
};

/**
 * Calculates returns for CDT (Standard bank formulation)
 */
export const calculateCDTReturns = (amount: number, months: number, tasaEA: number) => {
  const EA = tasaEA / 100;
  const days = months * 30; // Approximation
  
  // CDT formula usually uses days: (1 + EA)^(days/365)
  const interestsGross = amount * (Math.pow(1 + EA, days / 365) - 1);
  const retention = calculateRetention(interestsGross, 'CDT');
  const finalAmount = amount + interestsGross - retention;

  // Monthly average
  const monthlyInterests = interestsGross / months;
  const monthlyRetention = retention / months;
  const finalAmountMonthly = (amount / months) + monthlyInterests - monthlyRetention;

  return {
    interests: interestsGross,
    retention,
    finalAmount,
    interestsMonthly: monthlyInterests,
    retentionMonthly: monthlyRetention,
    finalAmountMonthly
  };
};

/**
 * Formats a number as COP currency
 */
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 1,
  }).format(value);
};
