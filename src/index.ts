import {
  YMap,
  YMapDefaultSchemeLayer,
  YMapFeatureDataSource,
  YMapLayer,
  YMapMarker,
  YMapControls,
  YMapControl,
  ready as ymaps3Ready,
  type LngLat
} from 'ymaps3';
import {type Feature} from '@yandex/ymaps3-clusterer';
import {BOUNDS, LOCATION, getRandomPoints} from './common';
import {ClustererChangeControl} from './ClustererChangeControl/ClustererChangeControl';
import markerSvg from './assets/pin.svg';

import './style/common.scss';

async function main() {
  await ymaps3Ready;

  const {YMapClusterer, clusterByGrid} = await import('@yandex/ymaps3-clusterer');

  let pointsCount = 100;

  const map = new YMap(document.getElementById('app'), {location: LOCATION});

  // Create and add to the map a layer with a map schema, data sources, a layer of markers
  map
    .addChild(new YMapDefaultSchemeLayer({}))
    .addChild(new YMapFeatureDataSource({id: 'clusterer-source'}))
    .addChild(new YMapLayer({source: 'clusterer-source', type: 'markers', zIndex: 1800}));

  // You can set any markup for the marker and for the cluster
  const contentPin = document.createElement('div');
  contentPin.innerHTML = `<img src="${markerSvg}" class="pin">`;

  /* We declare the function for rendering ordinary markers, we will submit it to the clusterer settings.
    Note that the function must return any Entity element. In the example, this is ymaps3.YMapMarker. */
  const marker = (feature: Feature) =>
    new YMapMarker(
      {
        coordinates: feature.geometry.coordinates,
        source: 'clusterer-source'
      },
      contentPin.cloneNode(true) as HTMLElement
    );

  // As for ordinary markers, we declare a cluster rendering function that also returns an Entity element.
  const cluster = (coordinates: LngLat, features: Feature[]) =>
    new YMapMarker(
      {
        coordinates,
        source: 'clusterer-source'
      },
      circle(features.length).cloneNode(true) as HTMLElement
    );

  function circle(count: number) {
    const circle = document.createElement('div');
    circle.classList.add('circle');
    circle.innerHTML = `
          <div class="circle-content">
              <span class="circle-text">${count}</span>
          </div>
      `;
    return circle;
  }

  /* We create a clusterer object and add it to the map object.
    As parameters, we pass the clustering method, an array of features, the functions for rendering markers and clusters.
    For the clustering method, we will pass the size of the grid division in pixels. */
  const clusterer = new YMapClusterer({
    method: clusterByGrid({gridSize: 64}),
    features: getRandomPoints(pointsCount, BOUNDS),
    marker,
    cluster
  });

  map.addChild(clusterer);

  // Creating handler functions for changing the clusterer. We will use these functions in a custom control
  function toggleClusterer() {
    if (clusterer.parent) {
      map.removeChild(clusterer);
    } else {
      map.addChild(clusterer);
    }
  }

  function changePointsCount(count: number) {
    pointsCount = count;
  }

  function updatePoints() {
    clusterer.update({features: getRandomPoints(pointsCount, map.bounds)});
  }

  // Creating and adding a custom clusterer change element to the map
  map.addChild(
    new YMapControls({position: 'bottom'}).addChild(
      new YMapControl({}).addChild(new ClustererChangeControl({toggleClusterer, changePointsCount, updatePoints}))
    )
  );
}
main();
