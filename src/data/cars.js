import gac from '../assets/img/car-gac.webp';
import peugeot from '../assets/img/car-peugeot.webp';
import mg from '../assets/img/car-mg.webp';
import audi from '../assets/img/car-audi.webp';

/* To add a car: import its image above and add an entry below.
   photo: true shows the whole photo; set it to false for a transparent cut-out on the garage backdrop.
   file sets Year, Mileage and Price (each defaults to "On request"), for example { Year: '2021', Mileage: '18,000 km' }.
   specs lists model facts as [label, value] pairs, for example [['Engine', '1.5 turbo']].
   The enquiry form and the hero count pick up new cars by themselves. */
export const CARS = [
  {
    name: 'GAC SUV',
    tag: 'GAC',
    img: gac,
    alt: 'Grey GAC SUV in the showroom',
    line: 'Grey SUV, in the showroom now.',
    blurb: 'Grey GAC SUV in our showroom. Ask us for the inspection report, service history and more photos of this exact car.',
    photo: true,
    specs: [],
    file: {},
  },
  {
    name: 'Peugeot Van',
    tag: 'Peugeot',
    img: peugeot,
    alt: 'Black Peugeot van in the showroom',
    line: 'Black Peugeot van, ready to see.',
    blurb: 'Black Peugeot van in our showroom. Ask us for the inspection report, service history and more photos of this exact vehicle.',
    photo: true,
    specs: [],
    file: {},
  },
  {
    name: 'MG Saloon',
    tag: 'MG',
    img: mg,
    alt: 'White MG saloon in the showroom',
    line: 'White saloon, in the showroom now.',
    blurb: 'White MG saloon in our showroom. Ask us for the inspection report, service history and more photos of this exact car.',
    photo: true,
    specs: [],
    file: {},
  },
  {
    name: 'Audi SUV Coupé',
    tag: 'Audi',
    img: audi,
    alt: 'Black Audi SUV coupé in the showroom',
    line: 'Black SUV coupé, ready to see.',
    blurb: 'Black Audi SUV coupé in our showroom. Ask us for the inspection report, service history and more photos of this exact car.',
    photo: true,
    specs: [],
    file: {},
  },
];

export const FIND_IT = 'Another car, please find it';
export const ENQUIRY_CARS = [...CARS.map((c) => c.name), FIND_IT, 'Not sure yet'];
