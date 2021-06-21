import firebase from './firebase';
import React from 'react';
import App from './App';

import { useState } from 'react';

import { handleSetMessage } from './DisplayCart'



const updateCart = (name, imgUrl, imgAlt, desc, quantity, size) => {

    const dbRef = firebase.database().ref();
    let count = 0;

    let isTheSame = false;
    let currentKey = 0;


    let newPoster = {
        name: name,
        imgUrl: imgUrl,
        imgAlt: imgAlt,
        description: desc,
        quantity: quantity,
        size: size,
        dataKey: 0

    }

    //This section is used to go through the data base and find the object with the key cart (this object represents the users cart) and then see if the newPoster we are adding already exists inside this cart object if it does then instead of adding the poster twice we can confirm if the cart object on firebase has a child object with the same properties as our newPoster above and if true then isTheSame is set to true because our poster exists and currentKey is set to the value(key) of the object in fireBase that has the same poster so we can update it next. Likewise this section also has a count that 
    dbRef.on('value', (response) => {
        // const arrayOfPosters = []; //used to hold the firebase objects
        const data = response.val();
        for (let key in data) {
            if (key === 'cart') {
                for (let value in data[key]) {
                    newPoster['dataKey'] = value;
                    count++; //count how many objects exist this section of our database this will be used if we create a newPoster child object
                    if (data[key][value].name === newPoster.name) { //if the current object in cart has a poster with the same name as our newPoster
                        if (data[key][value].size === newPoster.size) { //if this poster in cart is the same size as our new poster
                            if (data[key][value].quantity < 11) { //don't believe this section is necessary just used incase so hopefully the user cant purchase more then 10. The reason I think this is not necessary is because our form can only go up to 10 and we overwrite the data below. 
                                currentKey = value;

                                // console.log(value);
                                //then set the value of our current object to currentKey
                                isTheSame = true; //set is the same to true so our function below can run

                            }
                        }
                    }
                }
            }
        }
    })

    if (isTheSame) { //if true then this newPoster already exits inside our cart as child object and we should have the key for said object
        isTheSame = false; //return to false to prevent any possible loops
        newPoster['dataKey'] = currentKey;
        firebase.database().ref('cart').child(currentKey).set(newPoster); // rewrite that child object by passing the currentKey and our newPoster object

    } else { //else then just create a newPoster child object. Instead of auto generating a key we use the count + 1. For example if our database has 3 objects then we would be creating poster 4 
        console.log(typeof newPoster['dataKey']);
        newPoster['dataKey']++;
        firebase.database().ref('cart').child(newPoster['dataKey']).set(newPoster);
    }
}



export const cartSubmit = (e, props) => {

    e.preventDefault();
    if ((document.querySelector('#posterQuantity').value) > 0) {
        // console.log(e);

        const name = e.target.form.parentElement.childNodes[0].innerText;
        const size = document.querySelector('input[type=radio]:checked').value;
        const quantity = document.querySelector('#posterQuantity').value;
        const alt = e.target.parentElement.parentElement.parentElement.childNodes[0].alt;
        const url = e.target.parentElement.parentElement.parentElement.childNodes[0].src;
        const description = e.target.form.parentElement.childNodes[2].innerText;

        updateCart(name, url, alt, description, quantity, size);
    } else {
        console.log('need number');
    }

    props.showModalState(false);



}

function ModalOverlay(props) {
    console.log(props);
    const body = document.querySelector('body');
    body.style.overflow = 'hidden';
    // console.log(props);
    return (
        <div id='modal' className="posterModal">
            <div className="innerContent">

                <img src={props.posterToDisplay[0].imgUrl} alt={props.posterToDisplay[0].imgAlt} />
                <div className="formContainer">
                    <p className='title'>{props.posterToDisplay[0].name}</p>

                    <form action="">
                        <div>
                            <label htmlFor="posterQuantity">Quantity:</label>
                            <input type="number" id="posterQuantity" name="posterQuantity" min="1" max="10" defaultValue='1' />
                        </div>
                        <div>
                            <fieldset>
                                <legend>Choose your poster size</legend>
                                <input type="radio" id="sizeSmall" name="size" value="11x17" defaultChecked="checked" />
                                <label htmlFor="sizeSmall">11x17</label>

                                <input type="radio" id="sizeMedium" name="size" value="18x24" />
                                <label htmlFor="sizeMedium">18x24</label>

                                <input type="radio" id="sizeLarge" name="size" value="24x36" />
                                <label htmlFor="sizeLarge">24x26</label>
                            </fieldset>
                        </div>
                        <button id="formButton" onClick={(e) => cartSubmit(e, props)}>Add to Cart</button>
                        <button className="closeModalButton" onClick={() => props.showModalState(false)}>X</button>
                    </form>
                    <p className="modalDescription">{props.posterToDisplay[0].description}</p>
                </div>
            </div>
        </div >
    )
}

export default ModalOverlay;