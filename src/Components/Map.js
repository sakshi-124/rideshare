import React, { useRef, useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: 'YOUR_API_KEY',
  version: 'weekly',
});

const Map = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    loader.load().then(() => {
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 0, lng: 0 },
        zoom: 2,
      });
    });
  }, []);

  return <div ref={mapRef} style={{ height: '500px' }} />;
};

export default Map;
