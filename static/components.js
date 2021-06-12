/**
 * These could be pure functions = easy testing.
 */

let {html} = uhtml // From global

// an essential Button component example
const Header = () => html`
    <header>
        <h1>CIDRPit</h1>
        <p>TODO Some description here.</p>
    </header>
`

const NavBar = (roots, activeRoot, selectFn) => html`
    <nav class="tabs is-full">
        <a href="#!" class="${activeRoot ? '' : 'active'}" onclick=${(event) => selectFn(event, null)}>All</a>
        ${roots.map((root, i) => html`
            <a href="#!" class="${!!root.active ? 'active' : ''}" onclick=${(event) => selectFn(event, root)}>
                (${root.pool_name}) ${root.cidr}
            </a>
        `)}
    </nav>
`

const Reservations = (root, reservations) => {
    if (reservations.length === 0) {
        return html`<p class="text-center">No reservations${root ? ` for ${root.pool_name} root` : ''}.</p>`
    }
    return html`
    <table class="striped">
        <caption>${root ? `${root.pool_name} ` : ''}reservations</caption>
        <thead>
            <tr>
                <th>CIDR</th>
                <th>Pool</th>
                <th>Comment</th>
                <th>Created</th>
            </tr>
        </thead>
        <tbody>
            ${reservations.map((r, i) => html`
                <tr>
                    <td>${r.pool_name}</td>
                    <td>${r.cidr}</td>
                    <td>${r.comment}</td>
                    <td>${r.created}</td>
                </tr>
            `)}
        </tbody>
    </table>
    `
}

const Footer = () => html`
    <footer>
        TODO Footer <i data-feather="thumbs-up"></i>
    </footer>
`

export default {
    Header,
    NavBar,
    Reservations,
    Footer,
}
