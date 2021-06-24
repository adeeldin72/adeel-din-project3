import './App.css';
import firebase from './firebase';
import DisplayPosters from './DisplayPosters';
import ModalOverlay from './ModalOverlay';
import DisplayCart from './DisplayCart';
import Checkout from './Checkout';

import { useEffect, useState } from 'react';


function App() {

  // state used to hold the posters from firebase array of objects
  const [postersList, setPostersList] = useState([]);

  // state used to hold the users cart information array of objects
  const [userCart, setUserCart] = useState([]);

  // used to set if modal should be displayed or not true/false
  const [showModal, setShowModal] = useState(false);

  // used to hold a single object that will contain a selected images contents
  const [posterModal, setPosterModal] = useState([]);


  const [showMobileCart, setMobileCart] = useState(false);

  const [cartTotal, setCartTotal] = useState(0);

  const [finalCheckout, setFinalCheckout] = useState(false);

  // get firebase data on first state change
  useEffect(() => {
    const dbRef = firebase.database().ref(); //our database

    dbRef.on('value', (response) => {
      const arrayOfPosters = []; //used to hold the firebase poster objects
      const arrayOfPosters2 = []; //used to hold the firebase cart object
      const data = response.val(); //the response
      for (let key in data) { //for every object in response
        if (key !== 'cart') { //if the key of the response is an cart that means that this is the userCart the database looks like this {cart, poster1, poster2, poster3 etc....} so this skips the cart object
          arrayOfPosters.push({ key: key, poster: data[key] });
        } else if (key === 'cart') { //as aforementioned if the key equals cart then we are on our userCart object
          for (let value in data[key]) { //so we loop inside
            arrayOfPosters2.push(data[key][value]); //and push the cart inner child data
          }
        }
      }
      setPostersList(arrayOfPosters); //update the poster state
      setUserCart(arrayOfPosters2); //update the user state
    });
  }, [])

  // LEFT THIS INSIDE JUST INCASE I NEED IN FUTURE BUT I COMBINED IT WITH ABOVE CALL TO DATABASE
  // CART FIREBASE STUFF STARTS HERE
  // useEffect(() => {

  //   // console.log(defaultValue);
  //   const dbRef = firebase.database().ref();

  //   dbRef.on('value', (response) => {

  //     const arrayOfPosters = []; //used to hold the firebase objects
  //     const data = response.val();
  //     for (let key in data) {
  //       if (key === 'cart') {
  //         for (let value in data[key]) {
  //           arrayOfPosters.push(data[key][value]);

  //         }
  //       }
  //     }

  //     setUserCart(arrayOfPosters);

  //     //update the poster state
  //   });

  // }, [])

  // CART FIREBASE STUFF ENDS HERE

  // An example of the database and its inner contents
  // --myDefaultProject
  //        -cart
  //              - 2 ( <- This object is the pushed cart data)
  //                  -cost: 15
  //                  -dataKey: 2
  //                  -description: "A poster of the newest computer from the newest..."
  //                  -imgAlt: "An image for a poster of The newest computer fr..."
  //                  -imgUrl: "https://i.ibb.co/TBq182G/Untitled-Artwork-1.png"
  //                  -name: "THE NEWEST COMPUTER FROM BANANA"
  //                  -quantity: "2" 
  //                  -size: "11x17"
  //                  -sku: "658473920"
  //               - etc.....  ( <- This object is the pushed cart data)
  //          - poster1 ( <- This object is the pushed poster data)
  //              description: "Poster of colour full rectangles"
  //              imgUrl: "https://i.ibb.co/CBby52z/Untitled-Artwork-10.png"
  //              name: "A Maze"
  //              sku: 743665
  //          - poster2 ( <- This object is the pushed poster data)
  //              description: "Poster of a ribcage with a heart inside"
  //              imgUrl: "https://i.ibb.co/HrbQdqC/Untitled-Artwork-9.png"
  //              name: "A Trapped Heart"
  //              sku: 343654
  //          - etc........ ( <- This object is the pushed poster data)


  function updateCart(passedThis) { //used to update cart by passing the cart ul 



    for (let i = 0; i < passedThis.length; i++) { //and then going through each li

      const quantity = passedThis[i].childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes[1].value; //getting the current quantity
      const id = passedThis[i].childNodes[0].childNodes[0].id; //and the id on the image which relates back to the dataBase key

      if (quantity >= 0) { //if the quantity is zero
        if (quantity === '0') {
          firebase.database().ref('cart').child(id).remove(); //remove from database by using image id to find the item in the cart object in database
        } else {
          firebase.database().ref('cart').child(id).update({ quantity: quantity }); //or update the quantity
        }
      }
    }
  }



  const changeShowModal = (trueOrFalse) => { //function to change the modal it gets passed a boolean
    setShowModal(trueOrFalse);
  }

  // add event listeners to page
  useEffect(() => {

    window.addEventListener("keydown", (e) => { //add keyboard event listener
      // console.log(e);
      try {
        if (e.target.parentNode.children[0].childNodes[1].nodeName === 'IMG' && e.key === "Enter") { //if the we pressed enter on an img
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
            setPosterModal(posterObject); //set the poster modal object

            setShowModal(true); //and change the state to true so that the modal will be shown with the above poster object

          } catch { //throw error but does nothing

          }
        }
      } catch { //throw error but does nothing

      }
    });


    window.addEventListener('click', (e) => { //same thing for keyboard but this time for click

      //if you click on an image html element
      if (e.target.nodeName === 'IMG') {

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
          setPosterModal(posterObject); //set the poster modal object

          setShowModal(true); //and change the state to true so that the modal will be shown with the above poster object

        } catch { //throw error but does nothing

        }
      }

      if (e.target.id === 'modal') { //if we click on the modal background
        setShowModal(false); //remove modal by setting state back to false
        const body = document.querySelector('body'); //get body
        body.style.overflow = 'visible'; //and put back to visible

      }
      //this section is used to change the price on the modal screen depending on the radio button we clicked 
      if (e.target.id === 'sizeSmall') { //radio button id
        document.querySelector('.money').textContent = '15';
      } else if (e.target.id === 'sizeMedium') { //radio button id
        document.querySelector('.money').textContent = '25';
      } else if (e.target.id === 'sizeLarge') { //radio button id
        document.querySelector('.money').textContent = '35';
      }

    })

  }, [])

  // make sure that the body flow is set back to visible
  const body = document.querySelector('body');
  body.style.overflow = 'visible';



  useEffect(() => { //every time the updateCart changes change the total on screen
    let total = 0; //variable used to hold the total this total is without tax
    userCart.forEach(item => { //go through each item in userCart
      total += (item.cost * item.quantity); //multiple the cost with quantity
    })
    setCartTotal(total); //change state which would also re-render the price

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateCart])



  return ( //now we start returning stuff

    <div className="App">
      {/* Div that holds our background animation */}
      <div className="backgroundAnimation"></div>


      <header>
        <h1>Posters<span className="sr-only">Plus</span>+</h1>
      </header>
      {/*  Ternary operator if the user click checkout and change the state is now true then show the final checkout screen else do nothing  */}
      {finalCheckout ? <Checkout userCart={userCart} setUserCart={setFinalCheckout}></Checkout> : ''}

      <main className="wrapper">
        {/* This is our mobile design cart button that by default is hidden only shown on small screens */}
        <button className="cartButtonIcon" onClick={() => setMobileCart(true)}>
          <img src='./bag.png' alt="drawing of a bag with poster inside" />
        </button>
        {/* the container that holds all the posters */}
        <div className="postersContainer">

          {/* ternary operator used to show modal */}
          {
            showModal ? <ModalOverlay showModalState={() => changeShowModal()} posterToDisplay={posterModal} /> : ``
          }


          {/* display the images from the firebase returned database */}
          {
            postersList.map((postersList, index) => { //loop through the postersList and return array
              if (showModal) {
                return ''
              } else {
                return (<DisplayPosters key={index} name={postersList.poster.name} imgUrl={postersList.poster.imgUrl} description={postersList.poster.description} sku={postersList.poster.sku} />)
              }
            })
          }

        </div>
        {/* this is our cart container seen on the right side */}
        <div className="cartContainer">
          <p className="cartTitle">Cart</p>
          {/* this holds the actual products */}
          <div className="cartList">
            <ul>

              {

                userCart.map((userCart, index) => { //loop through our cart and use the same DisplayCart component to display the products
                  return (<li key={index}><DisplayCart key={index} quantity={userCart.quantity} imgUrl={userCart.imgUrl} imgAlt={userCart.imgAlt} size={userCart.size} dataBaseKey={userCart.dataKey} cost={userCart.cost} userCart={userCart} /></li>)

                })

              }
            </ul>
          </div>

          {/* ternary operator used to show our cart total if we have stuff in our cart */}
          {userCart.length > 0 ? <p className="cartFinalTotal"> Total: ${cartTotal}</p> : ''}

          {/* ternary operator used to show our cart update button which hidden by default or show our empty cart image */}
          {userCart.length > 0 ? <button className={`${"cartButton"} ${"blueButtonStyle"}`} id="updateButton" onClick={(e) => updateCart(e.target.parentElement.childNodes[1].childNodes[0].childNodes)}>Update Cart</button> :
            <img className="sadCart" src="./sadCart.png" alt="An empty cart" />
          }

          {/* ternary operator used to show our cart checkout button if our cart has items in it*/}
          {userCart.length > 0 ? <button className={`${"checkoutButton"} ${"blueButtonStyle"}`} id="checkoutCart" onClick={() => setFinalCheckout(true)}>Checkout</button> : ''}

        </div>

        { //ternary operator used to show the mobile cart if the mobile cart button is clicked
          showMobileCart ? <div className="mobileCartContainer">
            <p className="cartTitle">Cart</p>
            <button className={`${"mobileCartCloseButton"} ${"blueButtonStyle"}`} onClick={() => setMobileCart(false)}> Close Cart </button>

            <div className="cartList">
              <ul>
                { //same as above loop through user cart and use the same DisplayCart to display products
                  userCart.map((userCart, index) => {
                    return (<li key={index}><DisplayCart key={index} quantity={userCart.quantity} imgUrl={userCart.imgUrl} imgAlt={userCart.imgAlt} size={userCart.size} dataBaseKey={userCart.dataKey} cost={userCart.cost} userCart={userCart} /></li>)

                  })

                }
              </ul>
            </div>
            {/* ternary operator used to show our cart total if we have stuff in our cart */}
            {userCart.length > 0 ? <p className="cartFinalTotal"> Total: ${cartTotal}</p> : ''}

            {userCart.length > 0 ? <button className={`${"mobileCartButton"} ${"blueButtonStyle"}`} id="updateButton" onClick={(e) => updateCart(e.target.parentElement.childNodes[2].childNodes[0].childNodes)}>Update Cart</button> : ''}
            {userCart.length > 0 ? '' :
              <img className="sadCart" src="./sadCart.png" alt="An empty cart " />
            }
            {/* ternary operator used to show our cart checkout button if our cart has items in it*/}
            {userCart.length > 0 ? <button className={`${"checkoutButton"} ${"blueButtonStyle"}`} id="checkoutCart" onClick={() => setFinalCheckout(true)}>Checkout</button> : ''}


          </div> : ''
        }

      </main>
      {/* Footer */}
      <footer>
        <p>Created by <a href="https://www.linkedin.com/in/adeeldin/" target="_blank" rel="noopener noreferrer">Adeel Din </a> a student from <a href="https://junocollege.com/" target="_blank" rel="noopener noreferrer"> Juno College</a></p>
      </footer>
    </div >
  );
}


export default App;

// I haven't added comments on the other returns because I noticed they interfere with the code depending on how they are added so the rest of the components only have js commented