const {JSDOM} = require('jsdom')

async function crawlPage(baseUrl, currentUrl, pages) {
    const baseUrlObj = new URL(baseUrl)
    const currentUrlObj = new URL(currentUrl)

    if(baseUrlObj.hostname !== currentUrlObj.hostname) {
        return pages
    }

    // check apakah kita lagi ngecek link yg udah pernah di cek
    const normalizedCurrentUrl = normalizeURL(currentUrl)
    if (pages[normalizedCurrentUrl] > 0) {
        pages[normalizedCurrentUrl]++
        return pages
    }

    pages [normalizedCurrentUrl] = 1

    console.log(`actively crawling: ${currentUrl}`)  

    try {
        const res = await fetch(currentUrl)

        if (res.status > 399) {
            console.log(`error in fetch with status code: ${res.status}, on page: ${currentUrl}`)
            return pages
        }

        const contentType = res.headers.get("content-type")
        if (!contentType.includes('text/html')) {
            console.log(`non html response, content type received: ${contentType}, on page: ${currentUrl}`)
            return pages
        }

        const htmlBody = await res.text()

        const nextUrls = getUrlsFromHtml(htmlBody, baseUrl)

        for (const nextUrl of nextUrls) {
            pages = await crawlPage(baseUrl, nextUrl, pages)
        }

    } catch(err) {
        console.log(`error in fetch: ${err.message}, on page: ${currentUrl}`)
    }

    return pages
}

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
    normalizeURL, getUrlsFromHtml, crawlPage
}