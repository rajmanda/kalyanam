export interface RsvpDetails {
  description: string;
  id: string;
  name: string;
  date: string;
  image: string;
  location: string;
  rsvp: string;
  adults: number;
  children: number;
  username: string;
  useremail: string;
}

export interface RsvpDTO {
  rsvpId: number;
  rsvpDetails: RsvpDetails;
}

