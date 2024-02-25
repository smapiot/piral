interface Testimonial {
  id: string;
  phrase: string;
  lastName: string;
  firstName: string;
  face: string;
}

declare const testimonials: Array<Testimonial>;

export default testimonials;
