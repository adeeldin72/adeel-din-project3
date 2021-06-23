import React from "react";
import { useEffect, useRef, useState } from "react";

export default function Paypal(props) {

    const referenceArray = [];

    const [finalProducts, setFinalProducts] = useState([]);

    const paypal = useRef();
    const userCart = props.userCart;
    const userForm = props.userForm;
    console.log(userCart);
    console.log(userForm[0].phone);

    // ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789-
    // the string below is a shuffled version of the commented out one above (used https://onlinerandomtools.com/shuffle-letters to shuffle instead of creating a function in here)
    const randomIdChoices = 'bg6h3k21t9SKNoWUQ4jI7AXRvVTEBJaLODd8fw5pyGzrumlxP-CqscenZHMFiY'

    const randomId = () => {
        let newstring = '';
        let stringLength = (Math.floor(Math.random() * 255) + 1);
        if (stringLength < 1) {
            stringLength = 150;
        }
        for (let i = 1; i < stringLength; i++) {
            newstring += randomIdChoices.charAt(Math.floor(Math.random() * randomIdChoices.length));
        }
        if (referenceArray.includes(newstring)) {
            randomId();
        } else {
            referenceArray.push(newstring);
            return newstring;
        }
    }
    // useEffect(() => {
    //     const updatedArray = [];

    //     userCart.forEach(value => {
    //         const quantity = value.quantity;
    //         const productCost = value.cost;
    //         const description = value.description;
    //         const name = value.name;
    //         const size = value.size;
    //         const sku = value.sku;
    //         const tax = 1.13;

    //         const product = 
    //         updatedArray.push(product);
    //     }

    //     );

    //     setFinalProducts(updatedArray);

    // }, [])
    const generateItems = () => {

    }


    useEffect(() => {
        window.paypal.Buttons({
            createOrder: (data, actions, err) => {
                return actions.order.create({
                    intent: "CAPTURE",


                    purchase_units:

                        userCart.map(value => {
                            const quantity = value.quantity;
                            const productCost = value.cost;
                            const description = value.description;
                            const name = value.name;
                            const size = value.size;
                            const sku = value.sku;
                            const tax = 1.13;

                            console.log(value);
                            return (
                                {

                                    description: `${description} Size: ${size}`,

                                    amount: {
                                        currency_code: "CAD",
                                        value: ((productCost * quantity) * tax).toFixed(2),
                                        breakdown: {
                                            item_total: {
                                                value: productCost * quantity,
                                                currency_code: "CAD"
                                            }, tax_total: {
                                                currency_code: "CAD",
                                                value: ((productCost * quantity) * (tax - 1)).toFixed(2)
                                            },
                                        },

                                    },
                                    items: [
                                        {

                                            name: name,
                                            description: description,
                                            sku: sku,
                                            unit_amount: {
                                                currency_code: "CAD",
                                                value: productCost
                                            },
                                            tax: {
                                                currency_code: "CAD",
                                                value: (productCost * (tax - 1)).toFixed(2)
                                            },
                                            quantity: quantity,



                                        }
                                    ],
                                    reference_id: randomId()
                                }

                            )
                        })

                    ,
                    payer: {
                        email_address: userForm[0].email,
                        name: {
                            given_name: userForm[0].firstName,
                            surname: userForm[0].surName
                        },
                        // REmove if not working
                        phone: {
                            country_code: userForm[0].countryCode,
                            phone_number: {
                                national_number: String(userForm[0].phone)
                            }

                        },
                        // remove above it not working
                        address: {

                            address_line_1: userForm[0].address,
                            postal_code: userForm[0].zip,
                            country_code: userForm[0].countryCode,
                            admin_area_1: userForm[0].state


                        }
                    }
                })
            },
            onApprove: async (data, actions) => {
                const order = await actions.order.capture();
                console.log("Successful Order");
                console.log(order);
            },
            onError: (err) => {
                console.log(err);
            }
        }).render(paypal.current);
    }, [])

    return (
        <div>
            <div ref={paypal}></div> {/*grab paypal by useRef hook*/}
        </div>
    )
}