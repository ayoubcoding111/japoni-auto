import mustang from '../assets/img/car-mustang.webp';
import corvette from '../assets/img/car-corvette.webp';
import model3 from '../assets/img/car-model3.webp';
import wrangler from '../assets/img/car-wrangler.webp';

/* To add a car: import its image above and add an entry below.
   photo: true shows the whole photo; set it to false for a transparent cut-out on the garage backdrop.
   file sets Year, Mileage and Price (each defaults to "On request"), for example { Year: '2021', Mileage: '18,000 mi' }.
   specs lists model facts as [label, value] pairs, for example [['Engine', '5.0 V8']].
   The enquiry form and the hero count pick up new cars by themselves. */
export const CARS = [
  {
    name: 'Ford Mustang GT',
    tag: 'Ford',
    img: mustang,
    alt: 'Grey-blue Ford Mustang GT coupe',
    line: 'Grey-blue V8 coupe, ready to see.',
    blurb: 'Grey-blue Ford Mustang GT with the 5.0 V8. Ask us for the inspection report, service history and more photos of this exact car.',
    photo: true,
    specs: [],
    file: {},
  },
  {
    name: 'Chevrolet Corvette',
    tag: 'Chevrolet',
    img: corvette,
    alt: 'Silver Chevrolet Corvette Stingray in the showroom',
    line: 'Silver mid-engine Stingray, in the showroom now.',
    blurb: 'Silver Chevrolet Corvette Stingray in our showroom. Ask us for the inspection report, service history and more photos of this exact car.',
    photo: true,
    specs: [],
    file: {},
  },
  {
    name: 'Tesla Model 3',
    tag: 'Tesla',
    img: model3,
    alt: 'Red Tesla Model 3 in the showroom',
    line: 'Red electric saloon, in the showroom now.',
    blurb: 'Red Tesla Model 3 Long Range AWD in our showroom. Ask us for the inspection report, service history and more photos of this exact car.',
    photo: true,
    specs: [],
    file: {},
  },
  {
    name: 'Jeep Wrangler Rubicon',
    tag: 'Jeep',
    img: wrangler,
    alt: 'Green Jeep Wrangler Rubicon 4xe',
    line: 'Green Rubicon 4xe, ready for the trail.',
    blurb: 'Green Jeep Wrangler Rubicon 4xe plug-in hybrid. Ask us for the inspection report, service history and more photos of this exact vehicle.',
    photo: true,
    specs: [],
    file: {},
  },
];

export const FIND_IT = 'Another car, please find it';
export const ENQUIRY_CARS = [...CARS.map((c) => c.name), FIND_IT, 'Not sure yet'];
