export interface RsvpDetails {
  description: string;
  id: string;
  name: string;
  date: string;
  image: string;
  location: string;
  username: string;
  useremail: string;
  rsvp: string;
  adults: number;
  children: number;
  forGuest: string ;
}

export interface RsvpDTO {
  rsvpId: number;
  rsvpDetails: RsvpDetails;
}

