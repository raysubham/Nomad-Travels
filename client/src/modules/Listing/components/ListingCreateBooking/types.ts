export interface BookingsIndex {
  [key: string]: BookingsIndexYear
}

interface BookingsIndexYear {
  [key: string]: BookingsIndexMonth
}

interface BookingsIndexMonth {
  [key: string]: boolean
}
