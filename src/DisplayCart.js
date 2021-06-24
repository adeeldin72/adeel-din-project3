import { useEffect, useState } from 'react';
import React from 'react';

function DisplayCart(props) {

    var [name, setName] = useState(""); //state used to hold the input from form

    useEffect(() => { //used to set the state on load so that the proper value is displayed in input
        setName(props.quantity)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.userCart])

    return (
        //each poster is returned as a single div that has an image an an inner div with size, a inner form with quantity input when clicked shows the update button on screen, and lastly a total price   
        <div className="cartObject " >

            <img id={`${props.dataBaseKey}`} src={props.imgUrl} alt={props.imgAlt} />

            <div>

                <p>Size: {props.size}</p>

                <form action="">
                    <div>
                        <label htmlFor="posterQuantity">Quantity:</label>
                        <input type="number" id="posterQuantity" name="posterQuantity" min="0" max="10" value={name} onChange={(e) => {
                            setName((e.target.value)); //used to change the state so that the input value changes without this it never changes on re-render
                            document.querySelector("#updateButton").style.display = "block"; //onChange make update button appear
                        }} />

                    </div>
                </form>

                <p>${props.cost * props.quantity}</p>

            </div>
        </div>
    )
}

export default DisplayCart;

