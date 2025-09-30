import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/*
Sofa: Comfortable seating for stylish living spaces.
Coffee Table: Functional centerpiece for your living room.
TV Stand: Sleek support for your entertainment system.
Beds: Restful retreats for peaceful sleep.
Nightstands: Convenient bedside storage solutions.
Dresser: Stylish storage for your bedroom essentials.
Dining Table: Inviting centerpiece for family meals.
Chair: Comfortable seating for any room.
Sideboards & Buffets: Elegant storage for dining essentials.
Desks: Functional workspace solutions for productivity.
Office Chair: Supportive seating for productive workdays.
Bookcase: Organized display for your favorite reads.
Patio Furniture: Outdoor comfort for relaxing moments.
Garden Chairs: Stylish seating for outdoor spaces.
Tables: Versatile surfaces for any occasion.
*/
