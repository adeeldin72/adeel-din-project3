import './App.css';
import firebase from './firebase';
import { useEffect, useState } from 'react';

function App() {

  // state used to hold the posters from firebase
  const [postersList, setPostersList] = useState([]);

  // state used to hold the users cart information
  const [userCart, setUserCart] = useState([]);

  // get firebase data on first state change
  useEffect(() => {
    const dbRef = firebase.database().ref();

    dbRef.on('value', (response) => {
      const arrayOfPosters = []; //used to hold the firebase objects
      const data = response.val();
      for (let key in data) {
        arrayOfPosters.push({ key: key, poster: data[key] });
      }
      setPostersList(arrayOfPosters); //update the poster state
    });
  }, [])
  console.log(postersList);
  return (
    <div className="App">
      <header>
        <h1>Posters<span class="sr-only">Plus</span>+</h1>
      </header>
      <main>
        <div class="postersContainer">
          <div class="posterBlock">
            <p>Iron man Movie</p>
            <img src="https://images-na.ssl-images-amazon.com/images/I/71lVAGaqBtL._AC_SY879_.jpg" alt="" />
            <p>poster of the iron man movie</p>
          </div>
          <div class="posterBlock">
            <p>Iron man Movie</p>
            <img src="https://images-na.ssl-images-amazon.com/images/I/71lVAGaqBtL._AC_SY879_.jpg" alt="" />
            <p>poster of the iron man movie</p>
          </div>
          <div class="posterBlock">
            <p>Iron man Movie</p>
            <img src="https://images-na.ssl-images-amazon.com/images/I/71lVAGaqBtL._AC_SY879_.jpg" alt="" />
            <p>poster of the iron man movie</p>
          </div>
          <div class="posterBlock">
            <p>Iron man Movie</p>
            <img src="https://images-na.ssl-images-amazon.com/images/I/71lVAGaqBtL._AC_SY879_.jpg" alt="" />
            <p>poster of the iron man movie</p>
          </div>
          <div class="posterBlock">
            <p>Iron man Movie</p>
            <img src="https://images-na.ssl-images-amazon.com/images/I/71lVAGaqBtL._AC_SY879_.jpg" alt="" />
            <p>poster of the iron man movie</p>
          </div>
          <div class="posterBlock">
            <p>Iron man Movie</p>
            <img src="https://images-na.ssl-images-amazon.com/images/I/71lVAGaqBtL._AC_SY879_.jpg" alt="" />
            <p>poster of the iron man movie</p>
          </div>

          <div class="posterBlock">
            <p>Iron man Movie</p>
            <img src="https://images-na.ssl-images-amazon.com/images/I/71lVAGaqBtL._AC_SY879_.jpg" alt="" />
            <p>poster of the iron man movie</p>
          </div>
          <div class="posterBlock">
            <p>Iron man Movie</p>
            <img src="https://images-na.ssl-images-amazon.com/images/I/71lVAGaqBtL._AC_SY879_.jpg" alt="" />
            <p>poster of the iron man movie</p>
          </div>
          <div class="posterBlock">
            <p>Iron man Movie</p>
            <img src="https://images-na.ssl-images-amazon.com/images/I/71lVAGaqBtL._AC_SY879_.jpg" alt="" />
            <p>poster of the iron man movie</p>
          </div>
        </div>
        <div class="cartContainer">
          <p>Cart</p>
        </div>
      </main>
    </div>
  );
}

export default App;
