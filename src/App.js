import './App.css';
import firebase from './firebase';
import DisplayPosters from './DisplayPosters';
import ModalOverlay from './ModalOverlay';
import DisplayCart from './DisplayCart';

// import { cartSubmit } from './ModalOverlay';
import { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';


// import framework from https://www.npmjs.com/package/react-tilt used to give the images a tilt animation 
// import Tilt from 'react-tilt'


function App() {


  // state used to hold the posters from firebase array of objects
  const [postersList, setPostersList] = useState([]);

  // state used to hold the users cart information array of objects
  const [userCart, setUserCart] = useState([]);

  // used to set if modal should be displayed or not true/false
  const [showModal, setShowModal] = useState(false);

  // used to hold a single object that will contain a selected images contents
  const [posterModal, setPosterModal] = useState([]);

  const [defaultValue, setDefaultValue] = useState(0);

  const [cartValues, setCartValue] = useState([]);

  // get firebase data on first state change
  useEffect(() => {

    console.log(defaultValue);
    const dbRef = firebase.database().ref();

    dbRef.on('value', (response) => {
      const arrayOfPosters = []; //used to hold the firebase objects
      const data = response.val();
      for (let key in data) {
        if (key !== 'cart') {
          arrayOfPosters.push({ key: key, poster: data[key] });
        }
      }
      setPostersList(arrayOfPosters); //update the poster state
    });
  }, [])

  // CART FIREBASE STUFF
  useEffect(() => {

    // console.log(defaultValue);
    const dbRef = firebase.database().ref();

    dbRef.on('value', (response) => {

      const arrayOfPosters = []; //used to hold the firebase objects
      const data = response.val();
      for (let key in data) {
        if (key === 'cart') {
          for (let value in data[key]) {
            arrayOfPosters.push(data[key][value]);

          }
        }
      }

      setUserCart(arrayOfPosters);

      //update the poster state
    });

  }, [])

  function updateCart(passedThis) {
    console.log();


    for (let i = 0; i < passedThis.length; i++) {
      const quantity = passedThis[i].childNodes[1].childNodes[1].childNodes[0].childNodes[1].value;
      const id = passedThis[i].childNodes[0].id;
      console.log(quantity + " " + id);

      if (quantity === '0') {
        firebase.database().ref('cart').child(id).remove();
      } else {
        firebase.database().ref('cart').child(id).update({ quantity: quantity });
      }

    }
  }



  const changeShowModal = (event) => {
    setShowModal(event);
  }

  // add event listeners to page
  useEffect(() => {

    // console.log('i ran too');

    window.removeEventListener("click", (e) => {
      try {
        console.log(e.target.parentElement.children[0].innerText)
        console.log(e.target.parentElement.children[2].innerText)
      } catch {
        console.log('I failed');
      }
    });

    window.addEventListener("keydown", (e) => {
      // console.log(e);
      try {
        if (e.target.parentNode.children[0].childNodes[1].nodeName === 'IMG' && e.key === "Enter") {
          try { //try to run this if this image has all these children elements basically this will only run on the main page images and not for modal or cart images
            const posterObject = [
              {
                name: e.target.parentNode.children[0].childNodes[0].innerText,
                imgUrl: e.target.parentNode.children[0].childNodes[1].src,
                imgAlt: e.target.parentNode.children[0].childNodes[1].alt,
                description: e.target.parentNode.children[0].childNodes[2].innerText
              }
            ]
            //set the specific object to be shown
            setPosterModal(posterObject);

            setShowModal(true);

          } catch { //throw error but does nothing
            console.log('I failed');
          }
        }
      } catch {

      }
    });


    window.addEventListener('click', (e) => {
      // console.log(e);

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
      <div className="backgroundAnimation"></div>
      <header>
        <h1>Posters<span className="sr-only">Plus</span>+</h1>
      </header>
      <main>
        <div className="postersContainer">


          {/* ternary operator used to show modal */}
          {
            showModal ? <ModalOverlay showModalState={() => changeShowModal()} posterToDisplay={posterModal} /> : ``
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

        <div className="cartContainer">
          <p className="cartTitle">Cart</p>

          <div className="cartList">
            {
              console.log('I DID SOMETHING'),
              userCart.map((userCart) => {
                // console.log(userCart);
                return (<DisplayCart quantity={userCart.quantity} imgUrl={userCart.imgUrl} imgAlt={userCart.imgAlt} size={userCart.size} dataBaseKey={userCart.dataKey} userCart={userCart} />)

              })

            }
          </div>
          <button class="cartButton" id="updateButton" onClick={(e) => updateCart(e.target.parentElement.childNodes[1].childNodes)}>Update Cart</button>


        </div>
      </main>
    </div>
  );
}


export default App;
