import axios  from 'axios';
import Navbar from './Components/Navbar';


const fetchData = async () => {
  try {
    const response = await axios.get('/');
    const data = response.data;
    // Do something with the data
    console.log(data);
  } catch (error) {
    // Handle errors
    console.error(error);
  }
};

// Call the function to fetch data
fetchData();

function App() {
  return (
    <div className="App">
      <Navbar />
    </div>
  );
}

export default App;
