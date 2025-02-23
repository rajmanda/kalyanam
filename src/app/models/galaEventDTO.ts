export interface GalaEventDetails {
  name: string;
  date: string;
  location: string;
  image: string;
  description: string;
}
export interface GalaEventDTO {
  galaEventId: number;
  galaEventDetails: GalaEventDetails;
}
