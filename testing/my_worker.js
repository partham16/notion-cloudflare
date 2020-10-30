async function handleRequest() {
  const init = {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
  }
  
  // const URL = "https://www.notion.so/6754ee8b29d64be6b8cb25be1f9123b0"
  const URL = "https://www.notion.so"
  const response = await fetch(URL, init)
  const results = await response.text()
  
  // https://regex101.com/r/hP2NSw/2/
  const regex = /(?<=(href|src)=\")/gm;
  const subst = `https://www.notion.so`;
  const new_result = results.replace(regex, subst);
  
  // return new Response(new_result, init)
  // Make the headers mutable by re-constructing the Response
  new_response = new Response(new_result, response)
  let csp = response.headers.get('content-security-policy')
  let new_csp = csp.replaceAll("'self'", "'self' https://www.notion.so")
  new_response.headers.set('content-security-policy', new_csp)
  return new_response
}

addEventListener("fetch", event => {
  return event.respondWith(handleRequest())
})
