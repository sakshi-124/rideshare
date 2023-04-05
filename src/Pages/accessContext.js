import ApiContext from '../Common/ApiContext';
import { useContext } from 'react';

function MyComponent() {
  const { userData } = useContext(ApiContext);

  return (
    <div>
      {userData && <p>Hello, {userData.given_name}!</p>}
    </div>
  );
}

export default MyComponent;
