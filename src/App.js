import './App.css';
import firebase from './firebase';
import DisplayPosters from './DisplayPosters';
import ModalOverlay from './ModalOverlay';
import DisplayCart from './DisplayCart';
import Checkout from './Checkout';

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

  const [showMobileCart, setMobileCart] = useState(false);

  const [cartTotal, setCartTotal] = useState(0);

  const [finalCheckout, setFinalCheckout] = useState(false);

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
    console.log(passedThis);


    for (let i = 0; i < passedThis.length; i++) {
      // [0].childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes[1].value
      const quantity = passedThis[i].childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes[1].value;
      const id = passedThis[i].childNodes[0].childNodes[0].id;
      console.log(quantity + " " + id);
      if (quantity >= 0) {
        if (quantity === '0') {
          firebase.database().ref('cart').child(id).remove();
        } else {
          firebase.database().ref('cart').child(id).update({ quantity: quantity });
        }
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
                description: e.target.parentNode.children[0].childNodes[2].innerText,
                sku: e.target.parentNode.children[0].childNodes[3].innerText
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
        // console.log(e);
        try { //try to run this if this image has all these children elements basically this will only run on the main page images and not for modal or cart images
          const posterObject = [
            {
              name: e.target.parentElement.children[0].innerText,
              imgUrl: e.target.parentElement.children[1].src,
              imgAlt: e.target.parentElement.children[1].alt,
              description: e.target.parentElement.children[2].innerText,
              sku: e.target.parentElement.children[3].innerText,
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

      if (e.target.id === 'sizeSmall') {
        document.querySelector('.money').textContent = '15';
      } else if (e.target.id === 'sizeMedium') {
        document.querySelector('.money').textContent = '25';
      } else if (e.target.id === 'sizeLarge') {
        document.querySelector('.money').textContent = '35';
      }


    })

  }, [])

  // make sure that the body flow is set back to visible
  const body = document.querySelector('body');
  body.style.overflow = 'visible';


  useEffect(() => {
    let total = 0;
    userCart.forEach(item => {
      total += (item.cost * item.quantity);
    })
    setCartTotal(total);

  }, [updateCart])

  return (

    <div className="App">
      <div className="backgroundAnimation"></div>

      <header>
        <h1>Posters<span className="sr-only">Plus</span>+</h1>
      </header>

      {finalCheckout ? <Checkout userCart={userCart} setUserCart={setFinalCheckout}></Checkout> : ''}

      <main className="wrapper">
        <button className="cartButtonIcon" onClick={() => setMobileCart(true)}>
          <img src='./bag.png' alt="not fouund" />
        </button>
        <div className="postersContainer">

          {/* ternary operator used to show modal */}
          {
            showModal ? <ModalOverlay showModalState={() => changeShowModal()} posterToDisplay={posterModal} /> : ``
          }


          {/* display the images from the firebase returned database */}
          {
            postersList.map((postersList, index) => {
              if (showModal) {
                return ''
              } else {
                return (<DisplayPosters key={index} name={postersList.poster.name} imgUrl={postersList.poster.imgUrl} description={postersList.poster.description} sku={postersList.poster.sku} />)
              }
            })
          }



        </div>

        <div className="cartContainer">
          <p className="cartTitle">Cart</p>

          <div className="cartList">
            <ul>

              {

                userCart.map((userCart, index) => {
                  // console.log(userCart);
                  return (<li key={index}><DisplayCart key={index} quantity={userCart.quantity} imgUrl={userCart.imgUrl} imgAlt={userCart.imgAlt} size={userCart.size} dataBaseKey={userCart.dataKey} cost={userCart.cost} userCart={userCart} /></li>)

                })

              }
            </ul>
          </div>
          {userCart.length > 0 ? <p className="cartFinalTotal"> Total: ${cartTotal}</p> : ''}

          {userCart.length > 0 ? <button className="cartButton" id="updateButton" onClick={(e) => updateCart(e.target.parentElement.childNodes[1].childNodes[0].childNodes)}>Update Cart</button> :
            <img src="https://preview.redd.it/oiusqopzyw921.png?auto=webp&s=161acb5216d5fd660e66cce29e7e0845cb16fc3d" alt="" />
          }

          {userCart.length > 0 ? <button className="checkoutButton" id="checkoutCart" onClick={() => setFinalCheckout(true)}>Checkout</button> : ''}

        </div>
        {
          showMobileCart ? <div className="mobileCartContainer">
            <p className="cartTitle">Cart</p>
            <button className="mobileCartCloseButton" onClick={() => setMobileCart(false)}> Close Cart </button>

            <div className="cartList">
              <ul>
                {
                  userCart.map((userCart, index) => {
                    // console.log(userCart);
                    return (<li key={index}><DisplayCart key={index} quantity={userCart.quantity} imgUrl={userCart.imgUrl} imgAlt={userCart.imgAlt} size={userCart.size} dataBaseKey={userCart.dataKey} cost={userCart.cost} userCart={userCart} /></li>)

                  })

                }
              </ul>
            </div>
            {userCart.length > 0 ? <p className="cartFinalTotal"> Total: ${cartTotal}</p> : ''}

            {userCart.length > 0 ? <button className="mobileCartButton" id="updateButton" onClick={(e) => updateCart(e.target.parentElement.childNodes[2].childNodes[0].childNodes)}>Update Cart</button> : ''}


            {userCart.length > 0 ? <button className="checkoutButton" id="checkoutCart" onClick={() => setFinalCheckout(true)}>Checkout</button> : ''}


          </div> : ''
        }

      </main>
      <footer>
        <p>Created by <a href="https://www.linkedin.com/in/adeeldin/" target="_blank">Adeel Din </a> a student from <a href="https://junocollege.com/" target="_blank"> Juno College</a></p>
      </footer>
    </div>
  );
}


export default App;
