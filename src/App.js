import './App.css';
import firebase from './firebase';
import DisplayPosters from './DisplayPosters';
import ModalOverlay from './ModalOverlay';
import { useEffect, useState } from 'react';

// import framework from https://www.npmjs.com/package/react-tilt used to give the images a tilt animation 
import Tilt from 'react-tilt'


function App() {

  // state used to hold the posters from firebase array of objects
  const [postersList, setPostersList] = useState([]);

  // state used to hold the users cart information array of objects
  const [userCart, setUserCart] = useState([]);

  // used to set if modal should be displayed or not true/false
  const [showModal, setShowModal] = useState(false);

  // used to hold a single object that will contain a selected images contents
  const [posterModal, setPosterModal] = useState([]);

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



  useEffect(() => {

    window.removeEventListener("click", (e) => {
      try {
        console.log(e.target.parentElement.children[0].innerText)
        console.log(e.target.parentElement.children[2].innerText)
      } catch {
        console.log('I failed');
      }
    });

    window.addEventListener('click', (e) => {
      console.log(e);

      //if you click on an image html element
      if (e.target.nodeName === 'IMG') {
        try { //try to run this if this image has all these children elements basically this will only run on the main page images and not for modal or cart images
          const posterObject = [
            {
              name: e.target.parentElement.children[0].innerText,
              imgUrl: e.target.parentElement.children[1].src,
              imgAlt: e.target.parentElement.children[1].alt,
              description: e.target.parentElement.children[2].innerText
            }
          ]
          //set the specific object to be shown
          setPosterModal(posterObject);

          setShowModal(true);

        } catch { //throw error but does nothing
          console.log('I failed');
        }
      }

      if (e.target.id === 'modal') {
        setShowModal(false);
        const body = document.querySelector('body');
        body.style.overflow = 'visible';
      }


    })

  }, [])


  // console.log(posterModal);

  return (
    <div className="App">
      <div class="backgroundAnimation"></div>
      <header>
        <h1>Posters<span class="sr-only">Plus</span>+</h1>
      </header>
      <main>
        <div class="postersContainer">


          {/* ternary operator used to show modal */}
          {
            showModal ? <ModalOverlay /> : ``
          }


          {/* display the images from the firebase returned database */}
          {
            postersList.map((postersList) => {
              if (showModal) {
                return ''
              } else {
                return (<DisplayPosters name={postersList.poster.name} imgUrl={postersList.poster.imgUrl} description={postersList.poster.description} />)
              }
            })
          }






        </div>

        <div class="cartContainer">
          <p>Cart</p>
        </div>
      </main>
    </div>
  );
}

export default App;
