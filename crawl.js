const {JSDOM} = require('jsdom')

function getUrlsFromHtml(htmlBody, baseUrl){
    const urls = []
    const {window} = new JSDOM(htmlBody)
    const linkElements = window.document.querySelectorAll('a')
    for (const linkElement of linkElements) {
        if (linkElement.href.slice(0,1) === '/') {
            const absoluteUrl = `${baseUrl}${linkElement.href}`

            try {
                const urlObj = new URL(absoluteUrl)
                urls.push(urlObj.href)
            } catch (err) {
                console.log(`Error with ${linkElement.href} relative url: ${err.message}`)
            }
        } else {

            try {
                const urlObj = new URL(linkElement.href)
                urls.push(urlObj.href)
            } catch (err) {
                console.log(`Error with "${linkElement.href}" absolute url: ${err.message}`)
            }
        }

        // if (linkElement.href.includes('http')) {
        //     urls.push(linkElement.href)
        // } else {
        //     urls.push(`${baseUrl}${linkElement.href}`)
        // }
    }
    return urls
}

function normalizeURL(urlString) {
    const urlObj = new URL(urlString)
    const hostpath = `${urlObj.hostname}${urlObj.pathname}`
    if (hostpath && hostpath.slice(-1) === '/') {
        return hostpath.slice(0, -1)
    }
    return hostpath
}

module.exports = {
    normalizeURL, getUrlsFromHtml
}