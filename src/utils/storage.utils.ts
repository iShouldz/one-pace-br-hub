export const saveToLocalStorage = (key: string, value: any) => {
  try {
    const serializedValue = JSON.stringify(value)
    localStorage.setItem(key, serializedValue)
  } catch (error) {
    console.error(`Error saving to localStorage for key "${key}":`, error)
  }
}

export const getFromLocalStorage = (key: string): any | null => {
  try {
    const serializedValue = localStorage.getItem(key)
    return serializedValue ? JSON.parse(serializedValue) : null
  } catch (error) {
    console.error(`Error reading from localStorage for key "${key}":`, error)
    return null
  }
}
