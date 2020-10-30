// test in chrome console : before setting in cloudflare workers

// test for relative reference in href / src for notion css / js
const init = {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
  }

const response = await fetch("https://www.notion.so", init)

const results = await response.text()

//https://regex101.com/r/hP2NSw/2/

const regex = /(?<=(href|src)=\")/gm;
const subst = `https://www.notion.so`;
const new_result = results.replace(regex, subst);

// test for setting content-security-policy
// by default script residing in notion.so is not allowed
//   in *.workers.dev (in default csp we inherit from notion)
//   - notion's uses self - which refers to *.workers.dev now
// https://stackoverflow.com/questions/31211359/refused-to-load-the-script-because-it-violates-the-following-content-security-po

const init = {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
  }

// testing in *.workers.dev
//  notion.so here won't work - as, csp is not allowed for it (in *.workers.dev)
const response = await fetch("https://test1.partha.workers.dev/", init)

let csp = response.headers.get('content-security-policy')

csp.replaceAll("'self'", "'self' https://www.notion.so")
