export interface GalaEventDetails {

  name: string;
  date: string;
  location: string;
  image: string;
  description: string;
  comments: string;

 
  rsvpStatus?: string; // Make this optional
  forGuest?: string; // Make this optional
  adults?: number; // Make this optional
  children?: number; // Make this optional

}
export interface GalaEventDTO {
  galaEventId: number;
  galaEventDetails: GalaEventDetails;
}
