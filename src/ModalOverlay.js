import firebase from './firebase';

const updateCart = (name, imgUrl, imgAlt, desc, quantity, size) => {
    const dbRef = firebase.database().ref();
    let count = 0;
    const newPoster = {
        name: name,
        imgUrl: imgUrl,
        imgAlt: imgAlt,
        description: desc,
        quantity: quantity,
        size: size,
    }
    dbRef.on('value', (response) => {
        // const arrayOfPosters = []; //used to hold the firebase objects

        const data = response.val();
        for (let key in data) {
            if (key === 'cart') {
                for (let value in data[key]) {
                    count++;
                }
            }
        }
    })
    firebase.database().ref('cart').child(count + 1).set('hi');
}


export const cartSubmit = (e) => {
    e.preventDefault();
    if ((document.querySelector('#posterQuantity').value) > 0) {
        console.log(e);

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

    // console.log("need quantity");

}

function ModalOverlay(props) {
    console.log(props);
    const body = document.querySelector('body');
    body.style.overflow = 'hidden';
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
                        <button id="formButton" onClick={(e) => cartSubmit(e)}>Add to Cart</button>
                    </form>
                    <p className="modalDescription">{props.posterToDisplay[0].description}</p>
                </div>
            </div>
        </div >
    )
}

export default ModalOverlay;