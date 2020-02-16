interface Count {
  [key: string]: number;
}

const count: Count = {}

export const resetCount = (modalName: string): void => {
  count[modalName] = 0
}

export const getCount = (modalName: string): number => {
  if (!(modalName in count)) {
    resetCount(modalName)
  }
  return count[modalName]
}

export const updateCount = (modalName: string): number => {
  if (!(modalName in count)) {
    resetCount(modalName)
  }
  count[modalName] += 1
  return getCount(modalName)
}
