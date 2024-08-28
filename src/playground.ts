import './playground.scss'
import poster1 from './poster-1.jpeg'
import poster2 from './poster-2.jpeg'

window.onload = () => {

    const posters = [poster1, poster2]
    const images = document.querySelectorAll('img')
    images.forEach( (img, index) => {
        img.src = posters[index]
    })
}
