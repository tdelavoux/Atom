/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
    lang: 'en-US',
    title: 'Atom',
    description: 'Yet another light front-end framework designed for faster web developments.',

    // base: '/Atom/',
    lastUpdated: true,

    themeConfig: {
        siteTitle: 'Atom Documentation',
        logo: '/logo.png',
        nav: getNav(),
        sidebar: getSidebar(),
        editLink: {
            pattern: 'https://github.com/tdelavoux/Atom/edit/main/docs/:path'
        },
        socialLinks: [
            { icon: 'github', link: 'https://github.com/tdelavoux/Atom' },
        ],
        footer: {
            message: 'Released under no License ATM',
            copyright: 'Copyright © 2022-present Thibault Delavoux'
        }
    },

}

export default config;

function getSidebar() {
    return [
        {
            text: "Atom", items: [
                { text: 'Introduction', link: '/introduction' },
            ]
        },
        {
            text: 'Atom Components',
            collapsible: true,
            items: [
                { text: 'Introduction', link: '/atom-components/' },
                { text: 'Buttons', link: '/atom-components/buttons' },
                { text: 'Tabs', link: '/atom-components/tabs' },
            ]
        },
    ]
}

function getNav() {
    return [
        { text: 'Components', link: '/atom-components/', activeMatch: '/atom-components/.*' },
        { text: 'Write docs', link: '/how-to-use' },
        { text: 'The team', link: '/team' },
    ]
}