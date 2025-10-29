export function formatNumber(number, locale = "en-US", options = {}) {
  try {
    return new Intl.NumberFormat(locale, options).format(number);
  } catch (error) {
    console.error("Error formatting number:", error);

    return number.toString();
  }
}

export const formatName = (str) => {
  return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};
