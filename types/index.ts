export interface Package {
  id: string
  name: string
  region: string
  days: number
  nights: number
  price: number
  hero: 'terra' | 'forest' | 'dark'
  tag: string
  desc: string
}

export interface Booking {
  id: string
  customer: string
  phone: string
  package: string
  travelers: number
  depart: string
  amount: number
  status: 'Confirmed' | 'Pending' | 'Cancelled'
  payment: string
  created: string
}

export interface Inquiry {
  id: string
  name: string
  phone: string
  channel: string
  interest: string
  at: string
  unread: boolean
}

export interface Payment {
  id: string
  booking: string
  method: string
  amount: number
  status: 'Captured' | 'Refunded'
  at: string
}

export interface Testimonial {
  name: string
  trip: string
  text: string
  rating?: number
}
