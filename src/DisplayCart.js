import { useEffect, useState } from 'react';

import React from 'react';




function DisplayCart(props) {

    var [name, setName] = useState("");

    useEffect(() => {
        setName(props.quantity)
        console.log(name)
    }, [props.userCart])


    return (

        <div className="cartObject">
            <img id={`${props.dataBaseKey}`} src={props.imgUrl} alt={props.imgAlt} />
            <div>

                <p>Size: {props.size}</p>

                <form action="">

                    <div>
                        <label htmlFor="posterQuantity">Quantity:</label>
                        <input type="number" id="posterQuantity" name="posterQuantity" min="0" max="10" value={name} onChange={(e) => {
                            setName((e.target.value));
                            document.querySelector("#updateButton").style.display = "block"; //onChange make update button appear
                        }} />

                    </div>
                </form>




            </div>
        </div>
    )
}



export default DisplayCart;

