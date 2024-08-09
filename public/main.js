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

                        const style = document.querySelector('#images-sniper-style')
                        document.head.removeChild(style)
                        document.body.removeChild(overlay)
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

                const style = document.querySelector('#images-sniper-style')
                document.head.removeChild(style)
                document.body.removeChild(overlay)
            } else {

                const style = document.createElement('style')
                style.id = 'images-sniper-style'
                style.appendChild(document.createTextNode(CSS))
                document.head.appendChild(style)

                const overlay = document.createElement('div')
                overlay.id = 'images-sniper-overlay'
                document.body.append(overlay)
            }
        }
    })
})