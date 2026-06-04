export interface ItineraryDay {
  day: string
  title: string
  body: string
}

export interface Package {
  id: string
  name: string
  region: string
  days: number
  nights: number
  price: number
  hero: string
  hero_url?: string | null
  tag: string
  desc: string
  description?: string
  highlights?: string[]
  itinerary?: ItineraryDay[]
  inclusions?: string[]
  exclusions?: string[]
  active?: boolean
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

export interface Reel {
  id: string
  caption: string | null
  video_url: string | null
  poster_url: string | null
  instagram_url: string | null
  sort_order: number
  active: boolean
  created_at?: string
}
