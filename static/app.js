// uhtml setup. See https://github.com/WebReflection/uhtml
import {render, html, svg} from 'https://unpkg.com/uhtml?module'

// Contains the app - used for re-rendering.
let mainElement = null

// Global state
let data = {
    'roots': [],
    'reservations': []
}
window.data = data // For browser console debuggging

const getRoots = async () => {
    return fetch('/roots')
        .then(response => response.json())
}

const start = async (element) => {
    mainElement = element // set global for re-use on re-render.
    // Initial render
    data['roots'] = await getRoots()
    renderApp()
}

/**
 * Top-down (re-)render.
 * Note that micro html takes care of only replacing elements which change, so calling renderApp is cheap.
 * @param {*} data 
 */
const renderApp = () => {
    // console.log('renderApp.data', JSON.stringify(data, null, 2))
    console.log('renderApp.data', data)
    render(mainElement, html`
        <p>Hello 👋 µhtml</p>
        <nav class="tabs">
            ${data.roots.map(
                (root, i) => html`
                    <a href="#!" class="${!!root.active ? 'active' : ''}" onclick=${() => setActiveRoot(root)}>
                        (${root['pool_name']}) ${root['cidr']}
                    </a>
                `
            )}
        </nav>
        <p>
    `)
}

// TODO How about we pass uuids back for all items in db, then I can use metadata in state for stuf like "active tab".
const setActiveRoot = (selectedRoot) => {
    data.roots.forEach((root) => {
        root.active = root.cidr === selectedRoot.cidr ? true : false
    })
    renderApp() // TODO Reactivity on data with get/set?
}

// Export
const app = {
    start
}
export { app }
