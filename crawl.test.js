const {normalizeURL} = require('./crawl.js')
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