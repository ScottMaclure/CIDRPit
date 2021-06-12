// uhtml setup. See https://github.com/WebReflection/uhtml
import {render, html, svg} from 'https://unpkg.com/uhtml?module'

// Contains the app - used for re-rendering.
let mainElement = null

const getRoots = async () => {
    return fetch('/roots')
        .then(response => response.json())
}

const start = async (element) => {
    mainElement = element // set global for re-use on re-render.
    // Initial render
    renderApp({
        'roots': await getRoots()
    })
}

/**
 * Top-down (re-)render.
 * @param {*} data 
 */
const renderApp = (data) => {
    // console.log('renderApp.data', JSON.stringify(data, null, 2))
    console.log('renderApp.data', data)
    render(mainElement, html`<p>Hello 👋 µhtml</p>`)
}

// Export
const app = {
    start
}
export { app }
