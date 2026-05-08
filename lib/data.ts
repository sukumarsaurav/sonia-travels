import type { Package, Booking, Inquiry, Payment, Testimonial } from '@/types'

export const PACKAGES: Package[] = [
  { id: "manali", name: "Manali", region: "Himachal Pradesh", days: 5, nights: 4, price: 7200, hero: "terra", tag: "Mountains", desc: "Snow-capped peaks, apple orchards & the Beas river." },
  { id: "goa", name: "Goa", region: "West Coast", days: 4, nights: 3, price: 7200, hero: "forest", tag: "Beach", desc: "Sun-bleached beaches, Portuguese cafés & nightlife." },
  { id: "jaipur", name: "Jaipur", region: "Rajasthan", days: 4, nights: 3, price: 7200, hero: "terra", tag: "Heritage", desc: "Pink City forts, palaces & bazaars." },
  { id: "ooty", name: "Ooty", region: "Tamil Nadu", days: 4, nights: 3, price: 6300, hero: "forest", tag: "Hill Station", desc: "Tea gardens, toy trains & Nilgiri air." },
  { id: "munnar", name: "Munnar", region: "Kerala", days: 4, nights: 3, price: 6300, hero: "forest", tag: "Hill Station", desc: "Cardamom hills & emerald tea estates." },
  { id: "darjeeling", name: "Darjeeling", region: "West Bengal", days: 5, nights: 4, price: 8100, hero: "forest", tag: "Mountains", desc: "Tiger Hill sunrise & Kanchenjunga views." },
  { id: "uttarakhand", name: "Uttarakhand", region: "Himalayas", days: 6, nights: 5, price: 9000, hero: "forest", tag: "Mountains", desc: "Char Dham trails, Nainital & Rishikesh." },
  { id: "himachal", name: "Himachal Pradesh", region: "North India", days: 7, nights: 6, price: 10800, hero: "terra", tag: "Mountains", desc: "Shimla–Manali–Dharamshala circuit." },
  { id: "kerala", name: "Kerala", region: "South India", days: 6, nights: 5, price: 14400, hero: "forest", tag: "Backwaters", desc: "Houseboats, Kathakali & spice trails." },
  { id: "ladakh", name: "Ladakh", region: "High Himalaya", days: 8, nights: 7, price: 22500, hero: "dark", tag: "Adventure", desc: "Pangong Lake, Nubra Valley & monasteries." },
]

export const TESTIMONIALS: Testimonial[] = [
  { name: "Sushil Kumar", trip: "Manali · Apr 2026", text: "Efficient and timely reservations made planning a breeze. The service was quick and the team was helpful at every step.", rating: 4 },
  { name: "Shiva", trip: "Goa · Feb 2026", text: "Great offers and reasonably priced packages. The agent was patient with our changes and got us a brilliant hotel.", rating: 4 },
  { name: "Vk", trip: "Jaipur · Jan 2026", text: "Staff was very helpful and accommodating. Our itinerary felt personal — not a copy-paste tour.", rating: 4 },
  { name: "Dr. Manish Bhatt", trip: "Kerala · Dec 2025", text: "Hassle-free with organised stays and great recommendations on what to skip and what to linger on.", rating: 5 },
  { name: "Khudli Mata Co.", trip: "Outstation Taxi", text: "Car was well maintained and driver was very professional. Knew the route, the prices were too genuine.", rating: 5 },
]

export const FAQS = [
  { q: "How long does it take to issue air tickets?", a: "Depending on the route and airline availability, we usually finalise tickets within 2–3 working days to lock in the best fare." },
  { q: "Can you also book hotels and stays?", a: "Yes — we are a full-service travel arranger. Our agents will quote you on accommodation, sightseeing transfers and meal plans together with the package." },
  { q: "What is the cancellation policy?", a: "Standard airline non-refundable cancellation fees apply on flight tickets. Hotel and package cancellations follow the supplier's posted policy, which we share before you confirm." },
  { q: "Do you arrange visas for international travel?", a: "We assist with documentation, appointments and forwarding for most common leisure visas. Final approval is at the issuing consulate's discretion." },
  { q: "Is there a 24×7 helpline during the trip?", a: "Yes. Every confirmed booking gets a WhatsApp helpline number that's monitored round the clock — including weekends and holidays." },
]

export const BOOKINGS: Booking[] = [
  { id: "STT-2614", customer: "Anjali Sharma", phone: "+91 98155 ••• 12", package: "Manali", travelers: 4, depart: "12 May 2026", amount: 28800, status: "Confirmed", payment: "Razorpay · UPI", created: "2 May" },
  { id: "STT-2613", customer: "Rohit Verma", phone: "+91 99880 ••• 45", package: "Goa", travelers: 2, depart: "28 May 2026", amount: 14400, status: "Confirmed", payment: "Razorpay · Card", created: "2 May" },
  { id: "STT-2612", customer: "Preet Kaur", phone: "+91 78140 ••• 09", package: "Kerala", travelers: 2, depart: "06 Jun 2026", amount: 28800, status: "Pending", payment: "Awaiting", created: "1 May" },
  { id: "STT-2611", customer: "Manish Bhatt", phone: "+91 90414 ••• 78", package: "Ladakh", travelers: 6, depart: "18 Jun 2026", amount: 135000, status: "Confirmed", payment: "Razorpay · Netbanking", created: "1 May" },
  { id: "STT-2610", customer: "Shiva Nair", phone: "+91 96755 ••• 33", package: "Ooty", travelers: 3, depart: "22 May 2026", amount: 18900, status: "Confirmed", payment: "Razorpay · UPI", created: "30 Apr" },
  { id: "STT-2609", customer: "Vikram Sethi", phone: "+91 98765 ••• 21", package: "Jaipur", travelers: 2, depart: "10 May 2026", amount: 14400, status: "Cancelled", payment: "Refunded ₹14,400", created: "29 Apr" },
  { id: "STT-2608", customer: "Sushil Kumar", phone: "+91 70875 ••• 90", package: "Himachal", travelers: 5, depart: "15 May 2026", amount: 54000, status: "Confirmed", payment: "Razorpay · UPI", created: "28 Apr" },
  { id: "STT-2607", customer: "Neha Gill", phone: "+91 89888 ••• 14", package: "Darjeeling", travelers: 2, depart: "01 Jun 2026", amount: 16200, status: "Confirmed", payment: "Razorpay · Wallet", created: "27 Apr" },
  { id: "STT-2606", customer: "Arjun Mehra", phone: "+91 99100 ••• 56", package: "Uttarakhand", travelers: 4, depart: "12 Jun 2026", amount: 36000, status: "Pending", payment: "Awaiting", created: "27 Apr" },
  { id: "STT-2605", customer: "Pooja Rana", phone: "+91 95011 ••• 88", package: "Munnar", travelers: 2, depart: "20 May 2026", amount: 12600, status: "Confirmed", payment: "Razorpay · UPI", created: "26 Apr" },
]

export const INQUIRIES: Inquiry[] = [
  { id: "INQ-441", name: "Aarav Khanna", phone: "+91 98101 ••• 10", channel: "WhatsApp", interest: "Ladakh — 8N9D, July, 2 pax", at: "Today, 11:24", unread: true },
  { id: "INQ-440", name: "Simran Bedi", phone: "+91 70991 ••• 45", channel: "Web Form", interest: "Manali honeymoon, mid-June", at: "Today, 09:02", unread: true },
  { id: "INQ-439", name: "Rakesh Bansal", phone: "+91 98140 ••• 03", channel: "Phone", interest: "Outstation taxi to Jammu, Sat", at: "Yesterday", unread: false },
  { id: "INQ-438", name: "Tanya Chopra", phone: "+91 96506 ••• 71", channel: "WhatsApp", interest: "Goa for 5, end of May", at: "Yesterday", unread: false },
  { id: "INQ-437", name: "Karan Walia", phone: "+91 89889 ••• 22", channel: "Web Form", interest: "Kerala backwaters, anniversary", at: "2 May", unread: false },
]

export const PAYMENTS: Payment[] = [
  { id: "pay_NxR2k9LpMq", booking: "STT-2614", method: "UPI · 8460••@ybl", amount: 28800, status: "Captured", at: "2 May, 14:02" },
  { id: "pay_NxQ1aJ8nYk", booking: "STT-2613", method: "Card · •• 4242", amount: 14400, status: "Captured", at: "2 May, 11:18" },
  { id: "pay_NxP9mKpWzL", booking: "STT-2611", method: "Netbanking · HDFC", amount: 135000, status: "Captured", at: "1 May, 19:44" },
  { id: "pay_NxN8aLxYqM", booking: "STT-2610", method: "UPI · rohit••@okaxis", amount: 18900, status: "Captured", at: "30 Apr, 10:09" },
  { id: "pay_NxM4bVnRtZ", booking: "STT-2609", method: "Card · •• 1188", amount: 14400, status: "Refunded", at: "29 Apr, 17:30" },
  { id: "pay_NxL7kQjWmP", booking: "STT-2608", method: "UPI · 9988••@paytm", amount: 54000, status: "Captured", at: "28 Apr, 13:55" },
]

export const formatINR = (n: number) => '₹' + n.toLocaleString('en-IN')
