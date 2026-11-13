/**
 * Client testimonials, from the "Techne Customers Testimonials" form. Only the first name is kept here: the site shows
 * it followed by **** , and no surname or email address is stored in the code.
 * `quote` is one entry per paragraph. `rating` is out of 5.
 * To change the order, move entries. The home page shows the top-rated ones first (see `topTestimonials`).
 */
export interface Testimonial {
  firstName: string;
  company: string;
  services: string[];
  rating: number;
  quote: string[];
}

export const TESTIMONIALS: Testimonial[] = [
  {
    firstName: "Clarissa",
    company: "Xpac's IT Solutions",
    services: ["Consulting"],
    rating: 4,
    quote: [
      "I would like to express my sincere appreciation for the excellent service provided by our consultant. From the initial consultation to the completion of the process, the assistance was truly commendable. Very accommodating, professional, knowledgeable, and responsive to our concerns.",
      "Thank you for making the entire experience smooth and hassle-free. Your dedication and commitment to providing quality service are truly appreciated. Highly recommended!",
    ],
  },
  {
    firstName: "Lister",
    company: "Megalink Network and Data Solutions",
    services: ["IP Transit", "Consulting", "Colocation"],
    rating: 5,
    quote: [
      "We highly appreciate the excellent service and professional support provided by Techne Consulting as the network consultant of Megalink Networks.",
      "Their technical expertise, reliability, and commitment to delivering effective network solutions have been valuable in improving our network performance, stability, and overall service quality.",
      "The Techne Consulting team has consistently demonstrated professionalism, responsiveness, and dedication in addressing our technical needs.",
      "We are grateful for their continued support and partnership, and we highly recommend Techne Consulting to businesses looking for a knowledgeable, dependable, and results-driven network consulting partner.",
    ],
  },
  {
    firstName: "Patrick",
    company: "Megalink Network and Data Solutions – Carmen",
    services: ["Consulting"],
    rating: 5,
    quote: [
      "One of the best Tech Support ! The team is very responsive and always ready to assist whenever needed",
    ],
  },
  {
    firstName: "Jeffrey",
    company: "Central Linked Incorporated",
    services: ["IP Transit", "Consulting", "Metro E-line"],
    rating: 4,
    quote: [
      "Id been hearing Cliff Richards name floating around from other providers for a while. After checking out his background and seeing him present, we finally sat down to talk about our network headaches. Honestly, I was super impressed. He really knows how to break down a problem and give practical solutions. You can tell right away that his experience in the Telecom ISP industry is legit.",
      "Weve worked with a bunch of partners before, and the biggest issue was always a lack of transparency. As a business owner, I just want straight answers no BS. That’s exactly why our partnership with Techne works so well right now. \"Not to sound biased\" They are completely transparent, and we actually get the exact service we pay for. No hidden surprises. Im giving them 4 out of 5 stars for now, simply because our partnership is still quite new. ill definitely drop another review down the road once weve worked together longer. Really hope they keep this energy going. Huge props to Team Techne!",
    ],
  },
  {
    firstName: "Mau",
    company: "Go Wiser",
    services: ["Consulting", "Colocation"],
    rating: 5,
    quote: [
      "I just wanted to take a second to give a shout-out to the team here. In a world where customer service often feels like talking to a brick wall, these guys were a breath of fresh air. They were patient, friendly, and genuinely seemed to want to help to get things sorted. THANK YOU Techne team for a good services",
    ],
  },
  {
    firstName: "Jonathan",
    company: "Tierone Communication International Inc.",
    services: ["IP Transit", "Consulting"],
    rating: 5,
    quote: [
      "Having Cliff step in as our network consultant has been a game-changer. Thanks to his expert guidance especially with navigating our in establishing peering with various international telcos and our entire network is now a seamless, smooth operation.",
    ],
  },
  {
    firstName: "Jon",
    company: "ATSS Network and Data Solution",
    services: ["IP Transit", "Consulting", "Metro E-line", "Colocation"],
    rating: 5,
    quote: [
      "We've been working with Techne for our network requirements at ATSS Fiber, and so far, it's been a good experience. We appreciate their team's support, especially whenever we need assistance with technical concerns or network related matters.",
      "In our line of business, having a reliable partner really makes a difference. We're glad to have Techne as one of our technology partners, and we appreciate the effort they put into supporting our operations.",
      "Looking forward to more years of working together. Thank you, Techne team, and keep up the good work!",
    ],
  },
];

/** How many testimonials the home page shows before "View all". */
export const HOME_TESTIMONIAL_COUNT = 3;

/** The best-rated testimonials first. Equal ratings stay in the order they are listed above. */
export const topTestimonials = (count = HOME_TESTIMONIAL_COUNT) =>
  TESTIMONIALS.map((item, index) => ({ item, index }))
    .sort((a, b) => b.item.rating - a.item.rating || a.index - b.index)
    .slice(0, count)
    .map(({ item }) => item);

export const AVERAGE_RATING = TESTIMONIALS.reduce((sum, item) => sum + item.rating, 0) / TESTIMONIALS.length;
