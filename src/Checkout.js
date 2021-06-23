import { useState } from "react";
import Paypal from "./Paypal";
function Checkout(props) {
    const userCart = props.userCart;
    const [checkout, setCheckout] = useState(false);
    const [formData, setFormData] = useState([]);
    let total = 0;
    const tax = 1.13;
    userCart.forEach(value => {
        total += (value.cost * value.quantity);
    })
    const submitForm = (e) => {
        e.preventDefault();
        const formData = {
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
        console.log(formData);
        setCheckout(true);
        setFormData([formData]);
    }
    const closeModal = () => {
        props.setUserCart(false);
        setCheckout(false);
    }
    return (
        <div className='CheckoutModal'>
            {checkout ? (
                <div className="paypalContainer">
                    <button className="paypalModalCloseButton" onClick={() => closeModal()}><i class="far fa-times-circle"></i></button>
                    <Paypal userCart={userCart} userForm={formData} />
                </div>
            ) : (
                <div className="checkoutModalInnerItems">
                    <button className="checkoutModalCloseButton" onClick={() => closeModal()}><i class="far fa-times-circle"></i></button>

                    <div className="cartItems">
                        <p className="finalCheckoutTotal">Total + Tax: ${(total * tax).toFixed(2)}</p>
                        <ul>
                            {
                                props.userCart.map((value) => {
                                    return (<li className="finalUserCart">
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
                                <label for="fname"><i class="fas fa-user-alt"></i> Given Name</label>
                                <input type="text" id="fname" name="firstname" placeholder="John" required></input>
                                <label for="lname"><i class="fas fa-user-alt"></i> Surname</label>
                                <input type="text" id="lname" name="firstname" placeholder="Doe" required></input>
                                <label for="phone"><i class="fas fa-phone"></i> Phone Number:</label>
                                <input type="tel" id="phone" name="phone" pattern="^[0-9]{1,14}?$"></input>
                                <label for="email"><i class="fas fa-mail-bulk"></i> Email</label>
                                <input type="text" id="email" name="email" placeholder="john@example.com" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" required></input>
                                <label for="country">Country</label>
                                <select name="country" id="country">
                                    <option value="CA">CA</option>
                                    <option value="US">US</option>
                                </select>
                                <label for="adr"><i class="fas fa-address-card"></i> Address</label>
                                <input type="text" id="adr" name="address" placeholder="some street 123 street" required></input>
                                <label for="city"><i class="fas fa-city"></i> City</label>
                                <input type="text" id="city" name="city" placeholder="Toronto" required></input>

                            </div>
                            <div className="billingContainer2">
                                <div className="billingContainer3">
                                    <label for="state">Province/State</label>
                                    <input type="text" id="state" name="state" placeholder="ON" required></input>
                                </div>
                                <div className="billingContainer3">
                                    <label for="zip">Zip</label>
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