// uhtml setup. See https://github.com/WebReflection/uhtml
// import {render, html} from 'https://unpkg.com/uhtml?module'
let {render, html} = uhtml // From global
import c from './components.js'

// Contains the app - used for re-rendering.
let mainElement = null

// Global state
// TODO Think about a data model that works for UI
let data = {
    'roots': [],
    'reservations': [] // represents currently selected root's reservations
}
window.data = data // For browser console debuggging

const start = async (element) => {
    mainElement = element // set global for re-use on re-render.
    // Initial render
    await Promise.all([
        getRoots().then(roots => data['roots'] = roots),
        getReservations().then(reservations => data['reservations'] = reservations)
    ])
    return renderApp()
}

const getRoots = async () => {
    return fetch('/roots/')
        .then(response => response.json())
}

// TODO You can get ALL via "/reservations/" - would be a useful UI - an "All" tab.
const getReservations = async (root) => {
    return fetch(`/reservations/${root ? root.pool_name : ''}`)
        .then(response => response.json())
}

const getActiveRoot = () => {
    return data.roots.find(r => !!r.active)
}

// TODO How about we pass uuids back for all items in db, then I can use metadata in state for stuf like "active tab".
// TODO Deep-linking via hashbangs? Not needed?
const setRoot = async (event, root) => {
    event && event.preventDefault() && event.stopImmediatePropagation()
    
    data.roots.forEach((iterRoot) => {
        iterRoot.active = root && (iterRoot.cidr === root.cidr) ? true : false
    })

    data.reservations = await getReservations(root)

    renderApp() // TODO Reactivity on data with get/set?
}

/**
 * Top-down (re-)render.
 * Note that micro-html takes care of only replacing elements which change, so calling renderApp is cheap.
 */
const renderApp = () => {
    // console.log('renderApp.data', JSON.stringify(data, null, 2))
    console.log('renderApp.data', data)
    return render(mainElement, html`
        ${c.Header()}
        <div id="main">
            ${c.NavBar(data.roots, getActiveRoot(), setRoot)}
            ${c.Reservations(getActiveRoot(), data.reservations)}
        </div>
        ${c.Footer()}
    `)
}

// Export
export default {
    start
}
