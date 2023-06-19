const {normalizeURL, getUrlsFromHtml} = require('./crawl.js')
const {test, expect} = require('@jest/globals')

test('normalizeURL strip https', () => {
    const input = 'https://cleannfresh.com/blogs'
    const actual = normalizeURL(input)
    const expected = 'cleannfresh.com/blogs'
    expect(actual).toEqual(expected)
})

test('normalizeURL strip trailing slash', () => {
    const input = 'https://cleannfresh.com/blogs/'
    const actual = normalizeURL(input)
    const expected = 'cleannfresh.com/blogs'
    expect(actual).toEqual(expected)
})

test('normalizeURL strip capitals', () => {
    const input = 'https://cleanNFresh.com/blogs/'
    const actual = normalizeURL(input)
    const expected = 'cleannfresh.com/blogs'
    expect(actual).toEqual(expected)
})

test('normalizeURL strip http', () => {
    const input = 'http://cleannfresh.com/blogs/'
    const actual = normalizeURL(input)
    const expected = 'cleannfresh.com/blogs'
    expect(actual).toEqual(expected)
})

test('getUrlsFromHtml, absolute', () => {
    const inputHtmlBody = `
    <html>
        <body>
            <h1>Wellcome to cleannfresh website!</h1>
            <a href='https://cleannfresh.com/blogs'>
                see our blogs!
            </a>
        </body>
    </html>
    `
    const inputBaseUrl = 'https://cleannfresh.com'
    const actual = getUrlsFromHtml(inputHtmlBody, inputBaseUrl)
    const expected = ['https://cleannfresh.com/blogs']
    expect(actual).toEqual(expected)
})

test('getUrlsFromHtml, relative', () => {
    const inputHtmlBody = `
    <html>
        <body>
            <h1>Wellcome to cleannfresh website!</h1>
            <a href='/blogs'>
                see our blogs!
            </a>
        </body>
    </html>
    `
    const inputBaseUrl = 'https://cleannfresh.com'
    const actual = getUrlsFromHtml(inputHtmlBody, inputBaseUrl)
    const expected = ['https://cleannfresh.com/blogs']
    expect(actual).toEqual(expected)
})

test('getUrlsFromHtml, multiple links', () => {
    const inputHtmlBody = `
    <html>
        <body>
            <h1>Wellcome to cleannfresh website!</h1>
            <a href='/blogs'>
                see our blogs!
            </a>
            <a href='/items'>
                see our blogs!
            </a>
            <a href='https://youtube.com/cleannfresh/videos'>
                see our youtube channel!
            </a>
        </body>
    </html>
    `
    const inputBaseUrl = 'https://cleannfresh.com'
    const actual = getUrlsFromHtml(inputHtmlBody, inputBaseUrl)
    const expected = ['https://cleannfresh.com/blogs', 'https://cleannfresh.com/items', 'https://youtube.com/cleannfresh/videos']
    expect(actual).toEqual(expected)
})

test('getUrlsFromHtml, invalid link', () => {
    const inputHtmlBody = `
    <html>
        <body>
            <h1>Wellcome to cleannfresh website!</h1>
            <a href='/blogs'>
                see our blogs!
            </a>
            <a href='ObviouslyNotALink'>
                see our blogs!
            </a>
            <a href='https://youtube.com/cleannfresh/videos'>
                see our youtube channel!
            </a>
        </body>
    </html>
    `
    const inputBaseUrl = 'https://cleannfresh.com'
    const actual = getUrlsFromHtml(inputHtmlBody, inputBaseUrl)
    const expected = ['https://cleannfresh.com/blogs', 'https://youtube.com/cleannfresh/videos']
    expect(actual).toEqual(expected)
})