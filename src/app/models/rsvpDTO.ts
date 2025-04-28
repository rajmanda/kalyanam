export interface RsvpDetails {
  description: string;
  name: string;
  date: string;
  image: string;
  location: string;
  userName: string;
  userEmail: string;
  rsvp: string;
  adults: number;
  children: number;
  forGuest: string ;
  comments: string
}

export interface RsvpDTO {
  rsvpId: number;
  rsvpDetails: RsvpDetails;
}

