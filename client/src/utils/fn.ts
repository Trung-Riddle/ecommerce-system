export const generateCode = (string: string) =>
    string
      .normalize('NFD')
      .replace(/[^a-zA-Z ]/g, '')
      .slice(0, 10)
      .toUpperCase()
      .replace(/ /g, '')
      .split('')
      .reverse()
      .join('')