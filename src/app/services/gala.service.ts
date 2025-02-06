import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GalaService {
  constructor() {}
  events = [
    {
      id: '1',

      name: 'Nishchaya Tambulam',

      date: 'Aug 15th 2024',

      location: '5 Loius Ct, Plainsboro, NJ',

      image: '/assets/pictures/tambulam.jpg',

      description: 'description',
    },

    {
      id: '2',

      name: 'Break Day',

      date: 'Aug 15th 2024',

      location: '5 Loius Ct, Princeton, NJ',

      image: '/assets/pictures/funday.jpg',

      description: 'description',
    },

    {
      id: '3',

      name: 'Engagement & Sangeet',

      date: 'Aug 17th 2024',

      location: "RasBerry's, 834 NJ-12, French Town, NJ",

      image: '/assets/pictures/sangeet.jpg',

      description: 'description',
    },

    {
      id: '4',

      name: 'Haldi & Mehendi',

      date: 'Aug 18th 2024',

      location: '5 Loius Ct, Princeton, NJ',

      image: '/assets/pictures/mehendi.png',

      description: 'description',
    },

    {
      id: '5',

      name: 'Pellikuturu',

      date: 'Aug 19th 2024',

      location: '5 Loius Ct, Princeton, NJ',

      image: '/assets/pictures/pellikuthuru.jpg',

      description: 'description',
    },

    // {
    //   id: '6',

    //   name: 'Break Day',

    //   date: 'Aug 20th 2024',

    //   location: '5 Loius Ct, Princeton, NJ',

    //   image: '/assets/pictures/funday.jpg',

    //   description: 'description',
    // },

    {
      id: '7',

      name: 'Kalyanotsavam',

      date: 'Aug 21st 2024',

      location: '315 Churchill Ave, Somerset, NJ',

      image: '/assets/pictures/kalyanam.jpg',

      description: 'description',
    },

    {
      id: '8',

      name: 'Satyanarana Swamy Pooja',

      date: 'Aug 22st 2024',

      location: '605 Charleston Dr, Monroe, NJ',

      image: '/assets/pictures/satyanarayana-pooja.jpg',

      description: 'description',
    },
  ];
  getGalas() {
    return this.events;
  }

}
