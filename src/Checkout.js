function Checkout(props) {
    const userCart = props.userCart;
    let total = 0;
    const tax = 1.13;
    userCart.forEach(value => {
        total += (value.cost * value.quantity);
    })
    const submitForm = (e) => {
        e.preventDefault();
        console.log('I submitted');
    }
    return (
        <div className='CheckoutModal'>
            <div className="checkoutModalInnerItems">
                <button className="checkoutModalCloseButton" onClick={() => props.setUserCart(false)}>Close</button>

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
                            <label for="fname">Full Name</label>
                            <input type="text" id="fname" name="firstname" placeholder="John M. Doe"></input>
                            <label for="email"> Email</label>
                            <input type="text" id="email" name="email" placeholder="john@example.com"></input>
                            <label for="adr">Address</label>
                            <input type="text" id="adr" name="address" placeholder="542 W. 15th Street"></input>
                            <label for="city"> City</label>
                            <input type="text" id="city" name="city" placeholder="New York"></input>
                        </div>
                        <div className="billingContainer2">
                            <div className="billingContainer3">
                                <label for="state">State</label>
                                <input type="text" id="state" name="state" placeholder="NY"></input>
                            </div>
                            <div className="billingContainer3">
                                <label for="zip">Zip</label>
                                <input type="text" id="zip" name="zip" placeholder="10001"></input>
                            </div>
                        </div>
                        <button type="submit">Continue to payment</button>
                    </form>

                </div>

            </div>
        </div >

    )
}

export default Checkout;