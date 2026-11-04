/**
 * Short values that start with a number, such as "10U", "2 GB" or "12 months", read better in the data face.
 * Sentences and names stay in the body face, so a table never mixes the two within one kind of value.
 */
export const isDataValue = (text: string) => /^\d/.test(text) && text.length <= 28 && !/[A-Za-z]{7,}/.test(text);
