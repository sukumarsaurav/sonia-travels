export interface CabRoute {
  slug: string
  from: string
  to: string
  distance: string
  duration: string
  sedanPrice: number
  suvPrice: number
  ttPrice: number // Tempo Traveller
  highlights: string[]
  description: string
  seoTitle: string
  seoDesc: string
  popular: boolean
}

export const CAB_ROUTES: CabRoute[] = [
  {
    slug: 'pathankot-to-dalhousie',
    from: 'Pathankot', to: 'Dalhousie',
    distance: '80 km', duration: '2.5 hrs',
    sedanPrice: 1800, suvPrice: 2400, ttPrice: 4200,
    popular: true,
    highlights: ['Scenic mountain drive', 'Khajjiar en route', 'Hill station getaway', 'Door-to-door pickup'],
    description: 'Travel comfortably from Pathankot to the charming hill station of Dalhousie. Our cabs take the NH154A route through lush Dhar road, stopping on request at Khajjiar — the "Switzerland of India". All our drivers are verified locals who know the mountain bends well.',
    seoTitle: 'Pathankot to Dalhousie Cab | Taxi Booking ₹1,800 Onwards',
    seoDesc: 'Book reliable cab from Pathankot to Dalhousie. Sedan from ₹1,800, SUV ₹2,400. Door-to-door pickup, verified drivers. Call or WhatsApp 24×7.',
  },
  {
    slug: 'pathankot-to-dharamshala',
    from: 'Pathankot', to: 'Dharamshala',
    distance: '90 km', duration: '2.5 hrs',
    sedanPrice: 2000, suvPrice: 2600, ttPrice: 4500,
    popular: true,
    highlights: ['HPCA Cricket Stadium', 'Mcleodganj & Bhagsu waterfall', 'Dalai Lama temple', 'Tea gardens en route'],
    description: 'Dharamshala and Mcleodganj are just 90 km from Pathankot. Our cab service covers both the lower Dharamshala town and upper Mcleodganj. The drive takes you through Kangra valley with spectacular Dhauladhar views. Perfect for cricket fans, spiritual seekers and trekkers.',
    seoTitle: 'Pathankot to Dharamshala Cab | Taxi ₹2,000 | Mcleodganj Drop',
    seoDesc: 'Cab from Pathankot to Dharamshala / Mcleodganj starting ₹2,000. AC sedan & SUV. Verified drivers, 24×7 helpline. Book now.',
  },
  {
    slug: 'pathankot-to-amritsar',
    from: 'Pathankot', to: 'Amritsar',
    distance: '100 km', duration: '2 hrs',
    sedanPrice: 1900, suvPrice: 2500, ttPrice: 4300,
    popular: true,
    highlights: ['Golden Temple visit', 'Wagah Border ceremony', 'Jallianwala Bagh', 'Airport transfers'],
    description: 'Pathankot to Amritsar is a smooth 2-hour drive on NH44. We cover railway station, bus stand, airport (Sri Guru Ram Dass Jee International) and any hotel in Amritsar. Great for Golden Temple visits, Wagah Border ceremony and airport drop-offs.',
    seoTitle: 'Pathankot to Amritsar Cab | Taxi ₹1,900 | Airport Drop',
    seoDesc: 'Taxi from Pathankot to Amritsar from ₹1,900. Airport transfers, Golden Temple, Wagah Border. AC cabs, on-time pickup. Book 24×7.',
  },
  {
    slug: 'pathankot-to-jammu',
    from: 'Pathankot', to: 'Jammu',
    distance: '98 km', duration: '2.5 hrs',
    sedanPrice: 1900, suvPrice: 2600, ttPrice: 4400,
    popular: true,
    highlights: ['Raghunath Temple', 'Mubarak Mandi Palace', 'Bahu Fort', 'Jammu airport transfers'],
    description: 'Quick 98 km drive from Pathankot to Jammu on NH44. Our cabs cover Jammu city, Jammu Tawi railway station and Jammu Airport. Often used as a starting point for Vaishno Devi yatra — we can continue to Katra on the same booking.',
    seoTitle: 'Pathankot to Jammu Cab | Taxi ₹1,900 | Railway Station & Airport',
    seoDesc: 'Book cab Pathankot to Jammu from ₹1,900. Covers railway station, airport, Vaishno Devi via Katra. AC vehicles, verified drivers.',
  },
  {
    slug: 'pathankot-to-katra',
    from: 'Pathankot', to: 'Katra (Vaishno Devi)',
    distance: '115 km', duration: '3 hrs',
    sedanPrice: 2200, suvPrice: 2900, ttPrice: 5200,
    popular: true,
    highlights: ['Vaishno Devi yatra base', 'Ardhkuwari shrine en route', 'Katra market', 'Group pilgrimages'],
    description: 'Katra is the base camp for the Vaishno Devi Yatra, one of India\'s most visited pilgrimage sites. Our cab from Pathankot to Katra takes the NH44 through Jammu. We offer early morning pickups to match yatra registration slots, group Tempo Travellers for families, and return bookings.',
    seoTitle: 'Pathankot to Katra Cab | Vaishno Devi Taxi ₹2,200',
    seoDesc: 'Cab from Pathankot to Katra (Vaishno Devi base) ₹2,200. Early morning pickups, group vehicles, return trips. Book now — 24×7.',
  },
  {
    slug: 'pathankot-to-manali',
    from: 'Pathankot', to: 'Manali',
    distance: '275 km', duration: '7 hrs',
    sedanPrice: 5500, suvPrice: 6800, ttPrice: 10500,
    popular: true,
    highlights: ['Rohtang Pass gateway', 'Kullu valley', 'River Beas alongside NH3', 'Adventure sports hub'],
    description: 'The Pathankot to Manali drive is a full-day scenic journey through the Kangra valley and the Kullu valley. The route follows the Beas river through Mandi and Kullu before climbing into Manali. Best done with a comfortable SUV for mountain roads. Overnight cab also available.',
    seoTitle: 'Pathankot to Manali Cab | Taxi ₹5,500 | SUV & Sedan',
    seoDesc: 'Book cab from Pathankot to Manali from ₹5,500. 275 km, 7 hrs drive. AC SUV & sedan, experienced mountain drivers. Call 24×7.',
  },
  {
    slug: 'pathankot-to-chandigarh',
    from: 'Pathankot', to: 'Chandigarh',
    distance: '250 km', duration: '5 hrs',
    sedanPrice: 4500, suvPrice: 5500, ttPrice: 9000,
    popular: false,
    highlights: ['Rock Garden', 'Sukhna Lake', 'Airport transfers (CHD)', 'PGI hospital transfers'],
    description: 'Pathankot to Chandigarh is a 5-hour drive on NH44. We cover Chandigarh Railway Station, Chandigarh Airport (IXC), Sector 17, PGI Hospital, ISBT and all major hotels. Round-trip discounts available.',
    seoTitle: 'Pathankot to Chandigarh Cab | Taxi ₹4,500 | Airport Drop',
    seoDesc: 'Taxi from Pathankot to Chandigarh ₹4,500. Airport, railway station, PGI hospital transfers. AC cab, verified driver. Book 24×7.',
  },
  {
    slug: 'pathankot-to-shimla',
    from: 'Pathankot', to: 'Shimla',
    distance: '320 km', duration: '8 hrs',
    sedanPrice: 6000, suvPrice: 7500, ttPrice: 12000,
    popular: false,
    highlights: ['Mall Road & Ridge', 'Jakhu Temple', 'Christ Church', 'Toy train view'],
    description: 'Shimla, the capital of Himachal Pradesh, is a 320 km drive from Pathankot. The scenic route passes through Una, Bilaspur and Solan before the iconic mountain roads into Shimla. Our drivers are experienced on the hairpin bends of this route.',
    seoTitle: 'Pathankot to Shimla Cab | Taxi ₹6,000 | One Way & Round Trip',
    seoDesc: 'Cab from Pathankot to Shimla ₹6,000 one way. 320 km, experienced drivers, AC vehicles. Round-trip discounts. Book now.',
  },
  {
    slug: 'pathankot-to-delhi',
    from: 'Pathankot', to: 'Delhi',
    distance: '490 km', duration: '9 hrs',
    sedanPrice: 8500, suvPrice: 10500, ttPrice: 16000,
    popular: false,
    highlights: ['New Delhi Railway Station drop', 'IGI Airport transfers', 'Overnight cab option', 'All Delhi NCR areas'],
    description: 'Pathankot to Delhi is a long-haul cab ride of approximately 9 hours on NH44. We offer daytime and overnight options. Drop points include IGI Airport, New Delhi Railway Station, Connaught Place, Noida, Gurugram and all major Delhi NCR hotels.',
    seoTitle: 'Pathankot to Delhi Cab | Taxi ₹8,500 | Airport & Railway Drop',
    seoDesc: 'Book taxi from Pathankot to Delhi ₹8,500. IGI airport, railway station, all NCR areas. Overnight cabs available. 24×7 helpline.',
  },
  {
    slug: 'pathankot-to-mcleodganj',
    from: 'Pathankot', to: 'Mcleodganj',
    distance: '88 km', duration: '2.5 hrs',
    sedanPrice: 2000, suvPrice: 2600, ttPrice: 4500,
    popular: false,
    highlights: ['Dalai Lama temple', 'Bhagsu Nag waterfall', 'Triund trek base', 'Café culture'],
    description: 'Mcleodganj, the "Little Lhasa" of India, is easily reachable from Pathankot in 2.5 hours. Our cabs drop directly at the main square, Bhagsu Nag or Dharamkot based on your preference. Popular with solo travellers, yoga retreats and trekkers heading to Triund.',
    seoTitle: 'Pathankot to Mcleodganj Cab | Taxi ₹2,000 | Little Lhasa',
    seoDesc: 'Cab from Pathankot to Mcleodganj ₹2,000. Drop at main square, Bhagsu Nag or Dharamkot. AC taxi, verified driver. Book now.',
  },
]

export const VEHICLE_TYPES = [
  { id: 'sedan', name: 'Sedan',           examples: 'Swift Dzire, Etios, Amaze', seats: 4,  priceKey: 'sedanPrice' as const, rate: '₹12/km', desc: 'Comfortable for 1–4 passengers, best value for couples & small families.' },
  { id: 'suv',   name: 'SUV / MUV',       examples: 'Innova, Ertiga, Crysta',    seats: 7,  priceKey: 'suvPrice'   as const, rate: '₹16/km', desc: 'Spacious for families, ideal for mountain terrain and 5–7 passengers.' },
  { id: 'tt',    name: 'Tempo Traveller', examples: '9 / 12 / 17 seater',        seats: 17, priceKey: 'ttPrice'    as const, rate: '₹28/km', desc: 'Perfect for groups, pilgrimages, school trips and corporate outings.' },
]
