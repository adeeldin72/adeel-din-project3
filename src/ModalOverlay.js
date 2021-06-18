function ModalOverlay() {
    const body = document.querySelector('body');
    body.style.overflow = 'hidden';
    return (
        <div id='modal' class="posterModal">
            <div class="innerContent"></div>
        </div>
    )
}

export default ModalOverlay;