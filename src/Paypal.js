import React from "react";
import { useEffect, useRef, useState } from "react";

export default function Paypal(props) {

    const referenceArray = []; //used to hold reference ids as they are generated 

    const paypal = useRef();
    const userCart = props.userCart; //our user cart
    const userForm = props.userForm; //our user form info

    const [orderInfo, setOrderInfo] = useState([]); //used to hold two values in array the first is bool to check if order has succeeded and the second is the order object or error object




    // ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789-
    // the string below is a shuffled version of the commented out one above (used https://onlinerandomtools.com/shuffle-letters to shuffle instead of creating a function in here)
    const randomIdChoices = 'bg6h3k21t9SKNoWUQ4jI7AXRvVTEBJaLODd8fw5pyGzrumlxP-CqscenZHMFiY'

    const randomId = () => { //according to the paypal documentation if you have multiple items each item needs a reference_id so I used this function to give everything a random reference id I dont know if this is correct but this works. From my understanding the reference_id is used just to differentiate between the items in a users cart and nothing more. Not 100% sure about this though. 
        let newstring = ''; //create empty string
        let stringLength = (Math.floor(Math.random() * 255) + 1); //random number from 1-256
        if (stringLength < 1) { //if we somehow get zero or less
            stringLength = 150; //set to 150
        }
        for (let i = 1; i < stringLength; i++) { //loop through our random stringLength
            newstring += randomIdChoices.charAt(Math.floor(Math.random() * randomIdChoices.length)); //add a random string by using our randomIdChoices string and randomly choosing a character
        }
        if (referenceArray.includes(newstring)) { //I haven't tested this but my goal was that if we somehow generate a randomId that is the same to another one we created for our user so if we are on product 4 and our random id is the same as product 1 
            randomId(); //then call this function again to get new id
        } else { // push the newstring to our reference array to be added to our check
            referenceArray.push(newstring);
            return newstring; //return our id to be used in our item object down below
        }
    }

    useEffect(() => { //on load
        window.paypal.Buttons({ //our smart paypal button
            createOrder: (data, actions, err) => {
                return actions.order.create({ //create order
                    intent: "CAPTURE", //CAPTURE IS THE DEFAULT USED TO SAY TO GET THE FUNDS IMMEDIATELY AND NOT LATER


                    purchase_units: //our units to purchase this is an array

                        userCart.map(value => { //map through our userCart and return an array of objects with the proper values needed for the paypal sdk
                            const quantity = value.quantity;
                            const productCost = value.cost;
                            const description = value.description;
                            const name = value.name;
                            const size = value.size;
                            const sku = value.sku;
                            const tax = 1.13;


                            return (
                                {

                                    description: `${description} Size: ${size}`, //description for our product

                                    amount: { //amount for our product
                                        currency_code: "CAD", //the default currency for our product
                                        value: ((productCost * quantity) * tax).toFixed(2), //final total value
                                        breakdown: {
                                            item_total: { //our final total for total quantity for this product
                                                value: productCost * quantity,
                                                currency_code: "CAD"
                                            }, tax_total: { //our final tax total for this product
                                                currency_code: "CAD",
                                                value: ((productCost * quantity) * (tax - 1)).toFixed(2)
                                            },
                                        },

                                    },
                                    items: [ //more in depth description of our product
                                        {

                                            name: name, //product name
                                            description: description, //product description
                                            sku: sku, //product sku
                                            unit_amount: { //the value and currency of this product
                                                currency_code: "CAD",
                                                value: productCost
                                            },
                                            tax: { //product tax for this product
                                                currency_code: "CAD",
                                                value: (productCost * (tax - 1)).toFixed(2)
                                            },
                                            quantity: quantity, //total quantity of this product



                                        }
                                    ],
                                    reference_id: randomId() //our random id generated with the above function
                                }

                            )
                        })

                    ,
                    payer: { //this is the person paying and all this information is from our checkout form that was passed as a prop
                        email_address: userForm[0].email, //the email
                        name: { //there name split up
                            given_name: userForm[0].firstName,
                            surname: userForm[0].surName
                        },

                        //the user phone but not sure if this section works
                        phone: {
                            country_code: userForm[0].countryCode,
                            phone_number: {
                                national_number: String(userForm[0].phone)
                            }

                        },

                        //the user address
                        address: {

                            address_line_1: userForm[0].address,
                            postal_code: userForm[0].zip,
                            country_code: userForm[0].countryCode,
                            admin_area_1: userForm[0].state


                        }
                    }
                })
            }, //on approve do this
            onApprove: async (data, actions) => {
                const order = await actions.order.capture();

                setOrderInfo([true, order]); //set order info to [0] = true, and [1] = order object


            }, //on error do this
            onError: (err) => {
                setOrderInfo([false, err]); //set order info to [0] = false, and [1] = error object

            }
        }).render(paypal.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    //ternary objects used to display the papal button or the order success or the paypal button and the order failed div
    // grab paypal by useRef hook
    return (
        <div>
            {orderInfo[0] ? <div >
                <h2>Order Success</h2>
                <p>Thank you {orderInfo[1].payer.name.given_name} {orderInfo[1].payer.name.surname} for your order!</p>
                <p>Time: {orderInfo[1].create_time}</p>
                <p>Your Order Id : {orderInfo[1].id}</p>
                <p>Time: {orderInfo[1].create_time}</p>
                <p>Please check your email {orderInfo[1].payer.email_address} for more info</p>
            </div> : ""}
            {orderInfo[0] === false ? <div><h2>Order Failed</h2></div> : ""}
            {orderInfo[0] ? "" : <div ref={paypal}></div>}

        </div>
    )
}