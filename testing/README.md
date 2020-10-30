### Links

[`response.headers` : `content-security-policy` violation](https://stackoverflow.com/questions/31211359/refused-to-load-the-script-because-it-violates-the-following-content-security-po)
> the issue is that `notion.so` uses `self` in **csp** - but, in `*.workers.dev` - `self` doesn't refer to `notion` anymore
```javascript
let csp = response.headers.get('content-security-policy')
let new_csp = csp.replaceAll("'self'", "'self' https://www.notion.so")
new_response.headers.set('content-security-policy',new_csp)
```

--- ---

#### [Cloudflare examples](https://developers.cloudflare.com/workers/examples)
- [`fetch` `html` from a page and serve](https://developers.cloudflare.com/workers/examples/fetch-html)
    ```javascript
    const response = await fetch(URL, init)
    const results = await response.text()
    ```
    ```javascript
    addEventListener("fetch", event => {
    return event.respondWith(handleRequest())})
    ```

- [edit `response.header` after `fetch`](https://developers.cloudflare.com/workers/examples/alter-headers)
    ```javascript
    request = new Request(request)
    request.headers.set("x-my-header", "custom value")
    ```

--- ---

- [`regexp` in `JS`](https://regex101.com/r/hP2NSw/2/)

    ```javascript
    const regex = /(?<=(href|src)=\")/gm;
    const subst = `https://www.notion.so`;
    const new_result = results.replace(regex, subst);
    ```
