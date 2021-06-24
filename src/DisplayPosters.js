import Tilt from 'react-tilt' //imported library used for tilt function

function DisplayPosters(props) {
    // console.log(props);
    return (
        // this is the above imported library used to add tilt to the pictures
        <Tilt className="Tilt" options={{ max: 25, scale: 1, }} style={{ height: 'auto', width: 'auto' }} >
            <div className="posterBlock">
                <button className="posterButton" >
                    <p className="hide">{props.name}</p>
                    <img src={props.imgUrl} alt={`An image for a poster of ` + props.name} />
                    <p className="hide">{props.description}</p>
                    <p className="hide">{props.sku}</p>

                </button>
            </div>
        </Tilt >
    )
}

export default DisplayPosters;

// This section is used to display the content on the main screen into 