
export const devModeLog = (...args) => {
  if (process.env.NEXT_PUBLIC_ENV === 'local') {
    console.log(...args);
  }
}