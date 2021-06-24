import { useState } from "react";
import Paypal from "./Paypal"; //paypal stuff
function Checkout(props) {
    const userCart = props.userCart; //user cart prop added here
    const [checkout, setCheckout] = useState(false);
    const [formData, setFormData] = useState([]);

    let total = 0; //used to show total at end

    const tax = 1.13; //hard coded 13% tax but not the best way it would be better to get user location and use that to get there location tax amount and input here

    userCart.forEach(value => { //used to loop through all cart values and get the cart total without tax
        total += (value.cost * value.quantity);
    })

    const submitForm = (e) => { //on submit form 
        e.preventDefault();
        const formData = { //create form data
            firstName: document.querySelector('#fname').value,
            surName: document.querySelector('#lname').value,
            email: document.querySelector('#email').value,
            address: document.querySelector('#adr').value,
            city: document.querySelector('#city').value,
            state: document.querySelector('#state').value,
            zip: document.querySelector('#zip').value,
            phone: document.querySelector('#phone').value,
            countryCode: document.querySelector('#country').value,
        }

        setCheckout(true); //set checkout state to true
        setFormData([formData]); //change state
        //after this on rerender paypal will be true so paypal will show up and this formData and userCart const declared up above is passed to the paypal component to be used further. 
    }
    const closeModal = () => { //function used to close modal and remove checkout
        props.setUserCart(false);
        setCheckout(false);
    }
    //the return returns a checkout modal that has a modal background and container for the cart list on the left and a form container on the right. There is also a ternary operator used for Paypal when if paypal is true we display the paypal smart buttons the forms also have a required to make sure that they only submit once everything is inputted
    return (
        <div className='CheckoutModal'>
            {checkout ? (
                <div className="paypalContainer">
                    <button className="paypalModalCloseButton" onClick={() => closeModal()}><i className="far fa-times-circle"></i></button>
                    <Paypal userCart={userCart} userForm={formData} />
                </div>
            ) : (
                <div className="checkoutModalInnerItems wrapper2">
                    <button className="checkoutModalCloseButton" onClick={() => closeModal()}><i className="far fa-times-circle"></i></button>

                    <div className="cartItems">
                        <p className="finalCheckoutTotal">Total + Tax: ${(total * tax).toFixed(2)}</p>
                        <ul>
                            {
                                props.userCart.map((value, index) => {
                                    return (<li key={index} className="finalUserCart">
                                        <div className="innerDiv">
                                            <img src={value.imgUrl} alt={value.imgAlt} />
                                            <div>
                                                <p>Quantity: {value.quantity}</p>
                                                <p>Size: {value.size}</p>
                                                <p>Total: ${value.cost * value.quantity}</p>
                                            </div>
                                        </div>
                                    </li>)

                                })
                            }
                        </ul>

                    </div>
                    <div className="cartShipping">
                        <p className="formLabel">Shipping Info</p>
                        <form onSubmit={(e) => submitForm(e)}>
                            <div className="billingContainer1">
                                <label htmlFor="fname"><i className="fas fa-user-alt"></i> Given Name</label>
                                <input type="text" id="fname" name="firstname" placeholder="John" required></input>
                                <label htmlFor="lname"><i className="fas fa-user-alt"></i> Surname</label>
                                <input type="text" id="lname" name="firstname" placeholder="Doe" required></input>
                                <label htmlFor="phone"><i className="fas fa-phone"></i> Phone Number:</label>
                                <input type="tel" id="phone" name="phone" pattern="^[0-9]{1,14}?$"></input>
                                <label htmlFor="email"><i className="fas fa-mail-bulk"></i> Email</label>
                                <input type="text" id="email" name="email" placeholder="john@example.com" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" required></input>
                                <label htmlFor="country">Country</label>
                                <select name="country" id="country">
                                    <option value="CA">CA</option>
                                    <option value="US">US</option>
                                </select>
                                <label htmlFor="adr"><i className="fas fa-address-card"></i> Address</label>
                                <input type="text" id="adr" name="address" placeholder="some street 123 street" required></input>
                                <label htmlFor="city"><i className="fas fa-city"></i> City</label>
                                <input type="text" id="city" name="city" placeholder="Toronto" required></input>

                            </div>
                            <div className="billingContainer2">
                                <div className="billingContainer3">
                                    <label htmlFor="state">Province/State</label>
                                    <input type="text" id="state" name="state" placeholder="ON" required></input>
                                </div>
                                <div className="billingContainer3">
                                    <label htmlFor="zip">Zip</label>
                                    <input type="text" id="zip" name="zip" placeholder="A1A 1A1" required></input>
                                </div>
                            </div>
                            <button type="submit">Continue to payment</button>
                        </form>

                    </div>

                </div>

            )
            }
        </div >

    )
}

export default Checkout;