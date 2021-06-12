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

const start = async (element) => {
    mainElement = element // set global for re-use on re-render.
    // Initial render
    data['roots'] = await getRoots()
    renderApp()
}

const getRoots = async () => {
    return fetch('/roots')
        .then(response => response.json())
}

// TODO How about we pass uuids back for all items in db, then I can use metadata in state for stuf like "active tab".
// TODO Deep-linking via hashbangs? Not needed?
const setActiveRoot = (event, selectedRoot) => {
    event.preventDefault() && event.stopImmediatePropagation()
    data.roots.forEach((root) => {
        root.active = root.cidr === selectedRoot.cidr ? true : false
    })
    renderApp() // TODO Reactivity on data with get/set?
}

/**
 * Top-down (re-)render.
 * Note that micro html takes care of only replacing elements which change, so calling renderApp is cheap.
 */
const renderApp = () => {
    // console.log('renderApp.data', JSON.stringify(data, null, 2))
    console.log('renderApp.data', data)
    render(mainElement, html`
        <p>Hello 👋 µhtml</p>
        <nav class="tabs">
            ${data.roots.map(
                (root, i) => html`
                    <a href="#!" class="${!!root.active ? 'active' : ''}" onclick=${(event) => setActiveRoot(event, root)}>
                        (${root['pool_name']}) ${root['cidr']}
                    </a>
                `
            )}
        </nav>
    `)
}

// Export
const app = {
    start
}
export { app }
