export function formatMoneyFromCents(cents: number, currency = "USD") {
  const amount = cents / 100;
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

