export const getHeigthFromRatio = (type) => (width) => {
  switch (type) {
    case 'a4':
      const height = (width / 2480) * 3508
      return height
    default:
      return 0
  }
}