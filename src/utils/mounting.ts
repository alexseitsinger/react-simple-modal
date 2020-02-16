let mounted: string[] = []

export const addMounted = (modalName: string): void => {
  if (mounted.includes(modalName)) {
    return
  }
  mounted = [...mounted, modalName]
}

export const removeMounted = (modalName: string): void => {
  mounted = mounted.filter((n: string): boolean => n !== modalName)
}

export const hasMounted = (modalName: string): boolean => {
  return mounted.includes(modalName)
}
