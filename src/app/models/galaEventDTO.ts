export interface GalaEventDetails {
  id: string;
  name: string;
  date: String;
  location: String;
  image: String;
  description: string;
}
export interface GalaEventDTO {
  galaEventId: number;
  galaEventDetails: GalaEventDetails;
}