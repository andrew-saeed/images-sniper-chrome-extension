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

            // toggle links nav on/off
            const links = document.querySelectorAll('a:not(.image-sniper-link)')
            links.forEach(link => {
                link.classList.add('image-sniper-link')
                link.addEventListener('click', function(e) {
                    const overlay = document.querySelector('#images-sniper-overlay')
                    if(!!overlay) {
                        e.stopPropagation()
                        e.preventDefault()
                    } else {
                        window.location.href = this.href
                    }
                })
            })
            
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

                // init CSS style element
                const style = document.createElement('style')
                style.id = 'images-sniper-style'
                style.appendChild(document.createTextNode(CSS))
                document.head.appendChild(style)

                // init overlay
                const overlay = document.createElement('div')
                overlay.id = 'images-sniper-overlay'
                document.body.append(overlay)

                // init images wrappers
                const images = document.querySelectorAll('img')
                images.forEach( (img) => {

                    const sniperBtn = document.createElement('img')
                    sniperBtn.classList.add('image-sniper-btn')
                    sniperBtn.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF8zMF8yKSI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjNEMxMTJEIi8+CjxwYXRoIGQ9Ik0zMiA5NC4xNzMzVjk1LjE3MzNIMzNINDguODI3N0g0OS44Mjc3Vjk0LjE3MzNWODUuMDhWODQuMDhINDguODI3N0g0NC4yODhWNDMuOTJINDguODI3N0g0OS44Mjc3VjQyLjkyVjMzLjgyNjdWMzIuODI2N0g0OC44Mjc3SDMzSDMyVjMzLjgyNjdWNDIuOTJWNDMuOTJIMzNIMzcuNTM5N1Y4NC4wOEgzM0gzMlY4NS4wOFY5NC4xNzMzWk01My4zMTUgOTQuMTczM1Y5NS4xNzMzSDU0LjMxNUg1OC43MjQxSDU5LjcyNDFWOTQuMTczM1Y3NS40MDhDNTkuNzI0MSA3Mi40MjM2IDU5LjY4NjMgNjkuMjc0NyA1OS42MTA4IDY1Ljk2MTJDNTkuNTc2NSA2NC40NTczIDU5LjUzNyA2Mi45NjQ4IDU5LjQ5MjQgNjEuNDgzNkw2MC40MDg1IDY4LjM0ODNMNjAuNTI0MyA2OS4yMTZINjEuMzk5N0g2NS42OTU4SDY2LjU3NDdMNjYuNjg3NSA2OC4zNDQ0TDY3LjUyMDggNjEuOTA5OEM2Ny40ODEgNjMuMzk3OSA2Ny40NDM5IDY0Ljg4NiA2Ny40MDk0IDY2LjM3NDJDNjcuMzMzOSA2OS42MzIxIDY3LjI5NjEgNzIuNjQzNSA2Ny4yOTYxIDc1LjQwOFY5NC4xNzMzVjk1LjE3MzNINjguMjk2MUg3Mi43MDUySDczLjcwNTJWOTQuMTczM1YzMy44MjY3VjMyLjgyNjdINzIuNzA1Mkg2Ny4xMjc5SDY2LjI1MjZMNjYuMTM2NyAzMy42OTQyTDYzLjU3NDEgNTIuODcyOUw2My41NzM3IDUyLjg3NjJDNjMuNTcxNCA1Mi44OTMyIDYzLjU2OTIgNTIuOTEwMyA2My41NjcgNTIuOTI3M0M2My41NjQxIDUyLjkwNjcgNjMuNTYxMSA1Mi44ODYxIDYzLjU1ODEgNTIuODY1NUM2My41NTgxIDUyLjg2NDggNjMuNTU4IDUyLjg2NDIgNjMuNTU3OSA1Mi44NjM1TDYwLjg4MjcgMzMuNjg4NUw2MC43NjI1IDMyLjgyNjdINTkuODkyM0g1NC4zMTVINTMuMzE1VjMzLjgyNjdWOTQuMTczM1pNODAuODcwNCA5My41MTA0TDgwLjg3OTcgOTMuNTIxTDgwLjg4OTMgOTMuNTMxNEM4Mi4zODY1IDk1LjE0MjYgODQuMTg3NyA5NiA4Ni4yNTcxIDk2Qzg4LjM0OTQgOTYgOTAuMTQ1NyA5NS4xNDM4IDkxLjYwMDEgOTMuNTE3Mkw5MS42MDAxIDkzLjUxNzNMOTEuNjA2MSA5My41MTA0QzkzLjA0MzEgOTEuODczNyA5NC4xMTcxIDg5LjY1NDQgOTQuODcxMyA4Ni45MTYyTDk0Ljg3MjYgODYuOTExMUM5NS42Mjk4IDg0LjEwNDggOTYgODAuODQ0NSA5NiA3Ny4xNDRWNjIuMDk4N1Y2MS4wOTg3SDk1SDg1LjU3ODhIODQuNTc4OFY2Mi4wOTg3VjcxLjAyNjdWNzIuMDI2N0g4NS41Nzg4SDg5LjI1MTdWNzcuMTQ0Qzg5LjI1MTcgNzkuODkzOCA4OC45MDQxIDgxLjkwNTQgODguMjg2NiA4My4yNTk5TDg4LjI4NjUgODMuMjU5OEw4OC4yODExIDgzLjI3MjJDODcuOTg1NyA4My45NDQxIDg3LjY1OCA4NC4zNzAxIDg3LjMzNDMgODQuNjI1Qzg3LjAyNTggODQuODY3OSA4Ni42OCA4NC45ODkzIDg2LjI1NzEgODQuOTg5M0M4NS40OTkxIDg0Ljk4OTMgODQuNzkzNiA4NC41ODQxIDg0LjE4OTkgODMuMjU5OUM4My41NzI0IDgxLjkwNTQgODMuMjI0OCA3OS44OTM4IDgzLjIyNDggNzcuMTQ0VjUwLjc3MzNDODMuMjI0OCA0OC4wMiA4My41NzM1IDQ2LjA0NDIgODQuMTg0IDQ0Ljc1MjdDODQuNzc4NiA0My40OTUyIDg1LjQ3ODkgNDMuMDkzMyA4Ni4yNTcxIDQzLjA5MzNDODYuNjg5MSA0My4wOTMzIDg3LjAzOTggNDMuMjEzNiA4Ny4zNDgyIDQzLjQ0NzdDODcuNjcwMSA0My42OTIyIDg3Ljk5NDMgNDQuMDk4OSA4OC4yODY2IDQ0Ljc0MDFMODguMjg2NSA0NC43NDAyTDg4LjI5MjUgNDQuNzUyN0M4OC45MDIxIDQ2LjA0MjQgODkuMjUxNyA0OC4wNDQxIDg5LjI1MTcgNTAuODU2VjUxLjg1Nkg5MC4yNTE3SDk1SDk2VjUwLjg1NkM5NiA0Ny4xMDI2IDk1LjYzMDIgNDMuODM5NiA5NC44NzEyIDQxLjA4MzhDOTQuMTE4OCAzOC4zNTE2IDkzLjA0NTcgMzYuMTU1MyA5MS42MDMxIDM0LjU2ODdDOTAuMTU1MSAzMi44OTIxIDg4LjM1OSAzMiA4Ni4yNTcxIDMyQzg0LjE3NTQgMzIgODIuMzcyIDMyLjg5NTcgODAuODc5OSAzNC41NjE2Qzc5LjQzNDEgMzYuMTQ4OCA3OC4zNTg5IDM4LjM0NzUgNzcuNjA1MyA0MS4wODM4TDc3LjYwNTIgNDEuMDgzOEw3Ny42MDI5IDQxLjA5MjNDNzYuODcxIDQzLjg0NDkgNzYuNTE0MiA0Ny4xMDQ4IDc2LjUxNDIgNTAuODU2Vjc3LjE0NEM3Ni41MTQyIDgwLjg0MjIgNzYuODcxNCA4NC4wOTk1IDc3LjYwMTcgODYuOTAyN0w3Ny42MDE2IDg2LjkwMjhMNzcuNjA1MyA4Ni45MTYyQzc4LjM1OTQgODkuNjU0NCA3OS40MzM0IDkxLjg3MzcgODAuODcwNCA5My41MTA0WiIgZmlsbD0iI0NGREZCNiIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik02NCAwVjI4LjQ0NDRNNjQgOTkuNTU1NlYxMjhNMCA2NEgxNC4yMjIyTTI4LjQ0NDQgNjRIMTQuMjIyMk05OS41NTU2IDY0SDEyOE0xNC4yMjIyIDY0QzE0LjIyMjIgOTEuNDkxNiAzNi41MDg1IDExMy43NzggNjQgMTEzLjc3OEM5MS40OTE2IDExMy43NzggMTEzLjc3OCA5MS40OTE2IDExMy43NzggNjRDMTEzLjc3OCAzNi41MDg1IDkxLjQ5MTYgMTQuMjIyMiA2NCAxNC4yMjIyQzM2LjUwODUgMTQuMjIyMiAxNC4yMjIyIDM2LjUwODUgMTQuMjIyMiA2NFoiIHN0cm9rZT0iI0IzQ0IyMCIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF8zMF8yIj4KPHJlY3Qgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg=='
                    sniperBtn.addEventListener('click', async (e) => {
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