const CSS = `

    #images-sniper-overlay {
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.8);
        position: fixed;
        top: 0;
        left: 0;
        inset: 0;
        z-index: 999999;
    }

    .image-sniper-wrapper {
        position: relative;
        z-index: 9999999;
        padding: 0.5rem;
        border: 0.125rem solid white;
        border-radius: 0.3125rem;
    }

    .image-sniper-btn {
        position: absolute;
        bottom: 0.5rem;
        right: 0.5rem;
        width: 3rem;
        height: 3rem;
        background-color: black;
        border: 0.3125rem white solid;
        border-radius: 3.125rem;
        cursor: pointer;
    }
    .image-sniper-btn img {
        border-radius: 3.125rem;
    }
`

export default CSS