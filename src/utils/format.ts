export const createDate = (unixTimestamp: number) => {
  return new Date(unixTimestamp * 1000);
};

export const formatDate = (date: Date) => {
  return date.toLocaleDateString();
};

export const formatUnixTimestamp = (unixTimestamp: number) => {
  return formatDate(createDate(unixTimestamp));
};

export const formatCurrency = ({
  amount,
  locale,
  currency,
}: {
  amount: number;
  locale: string;
  currency: string;
}) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount / 100);
};
