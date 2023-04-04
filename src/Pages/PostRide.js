
import { useState, useEffect } from 'react';
import axios from 'axios';

function PostRide() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    if (searchQuery) {
      axios
        .get(`https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json`)
        .then((response) => {
          setSearchResults(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleResultClick = (location) => {
    setSelectedLocation(location);
  };

  return (
    <div>
      <input type="text" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
      <ul>
        {searchResults.map((result) => (
          <li key={result.osm_id} onClick={() => handleResultClick(result)}>
            {result.display_name}
          </li>
        ))}
      </ul>
    </div>
  );
}


export default PostRide;