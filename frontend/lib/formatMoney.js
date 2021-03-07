export default function formatMoney(amount = 0) {
  const options = {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
  };

  // check if its a clean dollar amount with no decimals
  if (amount % 100 === 0) {
    options.minimumFractionDigits = 0;
  }

  const formatter = Intl.NumberFormat('en-CA', options);

  return formatter.format(amount / 100);
}
