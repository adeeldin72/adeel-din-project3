import Tilt from 'react-tilt'

function DisplayPosters(props) {
    console.log(props);
    return (
        <Tilt className="Tilt" options={{ max: 35, scale: 1, }} style={{ height: 'auto', width: 'auto' }} >
            <div class="posterBlock">
                <p class="hide">{props.name}</p>
                <img src={props.imgUrl} alt={`An image for a poster of ` + props.name} />
                <p class="hide">{props.description}</p>
            </div>
        </Tilt >
    )
}

export default DisplayPosters;