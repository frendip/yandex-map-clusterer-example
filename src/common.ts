import type {YMapLocationRequest, LngLatBounds, LngLat} from 'ymaps3';
import type {Feature} from '@yandex/ymaps3-clusterer';

// Rectangle bounded by bottom-left and top-right coordinates
export const BOUNDS: LngLatBounds = [
  [36.76, 56.5],
  [38.48, 54.98]
];
export const LOCATION: YMapLocationRequest = {
  bounds: BOUNDS as LngLatBounds, // starting position
  zoom: 9 // starting zoom
};

// Function for generating a pseudorandom number
const seed = (s: number) => () => {
  s = Math.sin(s) * 10000;
  return s - Math.floor(s);
};

const rnd = seed(10000); // () => Math.random()

// Generating random coordinates of a point [lng, lat] in a given boundary
const getRandomPointCoordinates = (bounds: LngLatBounds): LngLat => [
  bounds[0][0] + (bounds[1][0] - bounds[0][0]) * rnd(),
  bounds[1][1] + (bounds[0][1] - bounds[1][1]) * rnd()
];

// A function that creates an array with parameters for each clusterer random point
export const getRandomPoints = (count: number, bounds: LngLatBounds): Feature[] => {
  return Array.from({length: count}, (_, index) => ({
    type: 'Feature',
    id: index.toString(),
    geometry: {type: 'Point', coordinates: getRandomPointCoordinates(bounds)}
  }));
};
