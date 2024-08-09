window.addEventListener('load', () => {
    chrome.runtime.connect({name: "side-panel-toggle"})
})