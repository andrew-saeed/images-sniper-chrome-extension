import CSS from "./style.js"

chrome.runtime.onConnect.addListener(function (port) {

    if(port.name === 'side-panel-toggle') {

        const pingInterval = setInterval(() => port.postMessage({ status: "ping"}), 10000)
        
        port.onDisconnect.addListener(async () => {

            const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true})

            chrome.scripting.executeScript({
                target: {tabId: tab.id},
                args: [],
                func:() => {

                    const overlay = document.querySelector('#images-sniper-overlay')
                    if(!!overlay) {

                        // clear CSS style and remove overlay
                        const style = document.querySelector('#images-sniper-style')
                        document.head.removeChild(style)
                        document.body.removeChild(overlay)
                        // clear images wrappers
                        const imgWrappers = document.querySelectorAll('.image-sniper-wrapper')
                        imgWrappers.forEach( imgWrapper => {
        
                            const img = imgWrapper.querySelector('img')
                            imgWrapper.parentNode.replaceChild(img, imgWrapper)
                        })
                    }
                }
            })

            clearInterval(pingInterval)
        })
    }
})

chrome.action.onClicked.addListener(async (tab) => {

    chrome.sidePanel.open({ windowId: tab.windowId })

    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        args: [CSS],
        func:(CSS) => {

            const overlay = document.querySelector('#images-sniper-overlay')
            
            if(!!overlay) {

                // clear CSS style and remove overlay
                const style = document.querySelector('#images-sniper-style')
                document.head.removeChild(style)
                document.body.removeChild(overlay)
                // clear images wrappers
                const imgWrappers = document.querySelectorAll('.image-sniper-wrapper')
                imgWrappers.forEach( imgWrapper => {

                    const img = imgWrapper.querySelector('img')
                    imgWrapper.parentNode.replaceChild(img, imgWrapper)
                })
            } else {

                // CSS style element
                const style = document.createElement('style')
                style.id = 'images-sniper-style'
                style.appendChild(document.createTextNode(CSS))
                document.head.appendChild(style)

                // overlay
                const overlay = document.createElement('div')
                overlay.id = 'images-sniper-overlay'
                document.body.append(overlay)

                // images
                const images = document.querySelectorAll('img')
                images.forEach( (img) => {

                    const sniperBtnIcon = document.createElement('img')
                    sniperBtnIcon.src = '/image_sniper_48.png'

                    const sniperBtn = document.createElement('div')
                    sniperBtn.classList.add('image-sniper-btn')
                    sniperBtn.appendChild(sniperBtnIcon)
                    sniperBtn.addEventListener('click', async () => {
                        await chrome.runtime.sendMessage({action: "img_shoot", src: img.src})
                    })

                    const imgWrapper = document.createElement('div')
                    imgWrapper.classList.add('image-sniper-wrapper')
                    imgWrapper.appendChild(img.cloneNode(true))
                    imgWrapper.appendChild(sniperBtn)
                    img.parentNode.replaceChild(imgWrapper, img)
                })
            }
        }
    })
})