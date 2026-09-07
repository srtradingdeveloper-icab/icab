/**
 * Default fare table — loaded from Firestore at runtime.
 * Admin can update via /admin → Fare Management.
 */
export const DEFAULT_FARES: Record<string, Record<string, number>> = {
  'Puri':        { dzire: 7500,  ertiga: 9000,  innova: 11000, suv: 13500 },
  'Bhubaneswar': { dzire: 2500,  ertiga: 3200,  innova: 3800,  suv: 4500  },
  'Konark':      { dzire: 3500,  ertiga: 4500,  innova: 5500,  suv: 6500  },
  'Chilika Lake':{ dzire: 4000,  ertiga: 5200,  innova: 6500,  suv: 8000  },
  'Cuttack':     { dzire: 1800,  ertiga: 2400,  innova: 3000,  suv: 3600  },
  'Dhenkanal':   { dzire: 2200,  ertiga: 2900,  innova: 3600,  suv: 4200  },
}

export const ROUND_TRIP_MULTIPLIER = 1.85

export const DESTINATIONS = Object.keys(DEFAULT_FARES)
export const DEFAULT_DESTINATIONS = DESTINATIONS

export const VEHICLES = [
  { value: 'dzire',  label: 'Swift Dzire',    seats: 4 },
  { value: 'ertiga', label: 'Ertiga',          seats: 6 },
  { value: 'innova', label: 'Innova Crysta',   seats: 7 },
  { value: 'suv',    label: 'SUV / Fortuner',  seats: 7 },
]

export function calcFare(destination: string, vehicle: string, fares = DEFAULT_FARES) {
  const oneWay = fares[destination]?.[vehicle] ?? 0
  const roundTrip = Math.round(oneWay * ROUND_TRIP_MULTIPLIER)
  return { oneWay, roundTrip }
}

export function formatINR(amount: number) {
  return '₹' + amount.toLocaleString('en-IN')
}
