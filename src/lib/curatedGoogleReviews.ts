/**
 * Manually supplied, selected positive customer feedback.
 * NOT a live Google Places API feed. The 5-star values below were read
 * from the provided Google Maps screen recording for these reviewers.
 * Overall rating and review count are a snapshot from that recording.
 * When Google Places is integrated, replace this curated data source.
 */
export type CuratedGoogleReview = {
  name: string;
  review: string;
  posted: string;
  rating?: number;
  profile?: string;
  ownerReply?: string;
};

export const CURATED_GOOGLE_REVIEWS: CuratedGoogleReview[] = [
  {
    name: 'Muhammed Yasin', rating: 5, posted: '5 months ago', profile: '2 reviews',
    review: 'I recently bought a laptop battery from this shop, and I am very satisfied with the purchase. The battery is working perfectly, holds a good charge, and performs just like the original one. The quality is excellent, and the shop provided good service. Installation was easy, and my laptop now runs for several hours without any issues.',
    ownerReply: 'We really appreciate your feedback, Muhammed Yasin. It is great to hear that you appreciated the variety of products we keep available. We are glad you had a positive experience with our team. We look forward to serving you again.',
  },
  {
    name: 'Sinu Saj', rating: 5, posted: '3 months ago', profile: '2 reviews',
    review: 'I recently purchased a laptop screen from this company and had a very good experience. The screen quality is excellent and works perfectly. The team was professional and helpful throughout the process. I’m very satisfied with the product and service. Highly recommended for laptop spare parts.',
    ownerReply: 'Many thanks for your review, Sinu Saj. We are pleased our product selection helped you find what you needed. Our team will be very pleased to know that the service made a positive impression. We look forward to serving you again.',
  },
  {
    name: 'Wajd AlKhawaldeh', rating: 5, posted: '3 months ago', profile: 'Local Guide · 16 reviews',
    review: 'They give me a price 500 dirhams cheaper than any other place. I fixed my MacBook at this store. The quality is off the top. It’s amazing. It’s as good as original. Definitely recommend the 10 out of 10',
    ownerReply: 'Many thanks for your review, Wajd AlKhawaldeh. It is great to know you found good value in our pricing. It is great to know you were satisfied with the product quality. Thank you for choosing Ghaza Computer TR. LLC.',
  },
  {
    name: 'Yawer Zeeshan', rating: 5, posted: 'a month ago', profile: '9 reviews',
    review: 'Mr. Sharek and Mr. Gaurav are always very helpful and supportive. I particularly appreciate Mr. Sharek’s honest and sincere advice. Their professionalism and willingness to assist make every interaction a positive experience.',
    ownerReply: 'Thank you, Yawer Zeeshan, for taking the time to share your experience. We are glad you had a positive experience with our team. Thank you for choosing Ghaza Computer TR. LLC.',
  },
  {
    name: 'sadham sirajudeen', rating: 5, posted: '6 months ago', profile: 'Local Guide · 33 reviews',
    review: 'Most of the model laptops spare parts available for very cheap price',
  },
  {
    name: 'Hayan Jafar', rating: 5, posted: 'a week ago', profile: '5 reviews',
    review: 'Very beautiful shop very good customer service I had a very nice experience there',
    ownerReply: 'Thank you for your kind feedback, Hayan Jafar. We are glad you had a positive experience with our team. We hope to welcome you back again soon.',
  },
  {
    name: 'Irshad Kp', rating: 5, posted: '3 months ago', profile: '6 reviews',
    review: 'Good quality laptop spare parts at reasonable prices. Friendly service and highly recommended🤩',
    ownerReply: 'Many thanks for your review, Irshad Kp. We are pleased that our prices met your expectations. We are pleased our product selection helped you find what you needed. We appreciate your business and look forward to assisting you again.',
  },
  {
    name: 'Shahana', rating: 5, posted: '2 months ago', profile: '5 reviews',
    review: 'Very good shop for laptop spare parts. Bought a battery from them and it is working perfectly',
    ownerReply: 'Thank you, Shahana, for taking the time to share your experience. We are also happy that our range of computers and spare parts was useful to you. We appreciate your business and look forward to assisting you again.',
  },
  {
    name: 'Salman Zubair', rating: 5, posted: '3 months ago', profile: '9 reviews',
    review: 'Very satisfied with their service. They are reliable, responsive, and committed to providing quality spare parts',
    ownerReply: 'Thank you for your kind feedback, Salman Zubair. We are pleased our product selection helped you find what you needed. We are glad you had a positive experience with our team. Thank you for choosing Ghaza Computer TR. LLC.',
  },
  {
    name: 'Shabbu Ali', rating: 5, posted: '3 months ago', profile: 'Local Guide · 147 reviews',
    review: "Awesome Very Nice used laptops shop please visit this area it's nice used Laptops shop very cheap and discounted prices",
    ownerReply: 'We really appreciate your feedback, Shabbu Ali. It is great to know you found good value in our pricing. We are pleased our product selection helped you find what you needed. We look forward to serving you again.',
  },
  {
    name: 'Nesbert Gora', rating: 5, posted: '3 months ago', profile: 'Local Guide · 8 reviews',
    review: 'They have a wide variety of products of computers spare parts at competitive prices.',
    ownerReply: 'Thank you, Nesbert Gora, for your excellent review and support. We are pleased that you had a positive experience with Ghaza Computer TR. LLC. We look forward to serving you again.',
  },
  {
    name: 'MOUAZ AL KHTEEB', posted: '9 months ago', profile: 'Local Guide · 63 reviews',
    review: "The sales staff are excellent. I had an experience with them. I didn't get to know their names, but he was wearing a white Islamic cap. He helped me find all the parts for my computer. He didn't hesitate to contact them to get the parts even though he didn't have them. Thank you very much.",
  },
  {
    name: 'Shah Idris', posted: '4 months ago', profile: 'Local Guide · 272 reviews',
    review: 'Best spares,laptop repair of all sorts, chargers replacement,screen replacement ,, system troubleshooting,all at its best',
    ownerReply: 'Many thanks for your review, Shah Idris. It is great to hear that you appreciated the variety of products we keep available. We hope to welcome you back again soon.',
  },
  {
    name: 'Muhammed Shanif', posted: '5 months ago', profile: '3 reviews',
    review: 'Outstanding service and genuine laptop spare parts. Highly satisfied!',
    ownerReply: 'Thank you for your kind feedback, Muhammed Shanif. We are pleased our product selection helped you find what you needed. Our team will be very pleased to know that the service made a positive impression. We look forward to serving you again.',
  },
  {
    name: 'Dina Habeeba', rating: 5, posted: '5 months ago', profile: '3 reviews',
    review: 'Genuine spare parts at reasonable prices. Excellent customer service.',
  },
];
