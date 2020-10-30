# Notion + Cloudflare as a blog service
A super simple way to publish personal pages / blogs using Notion as CMS and Cloudflare Workers as publisher

## Check out [Demo website](https://notion.partha.workers.dev/)

## TL;DR
- Copy the [`worker.js`](https://github.com/partham16/notion-cloudflare/blob/main/worker.js) to [Cloudflare](https://dash.cloudflare.com/login) and edit the **configuration**
  > The `.js` file is almost completely influenced by [fruition](https://github.com/stephenou/fruitionsite)

  > Except that I faced an [Issue](https://github.com/stephenou/fruitionsite/issues/58) and sent in a [Pull Request](https://github.com/stephenou/fruitionsite/pull/59)

## Tools
- [Notion](https://www.notion.so/)

  > Notion is great tool that lets you manage your workspace - and that's what we are going to use as our CMS i.e. content management
  <details>
  <summary>Different options available at Notion</summary>
  <img src="https://prod-notion-assets.s3-us-west-2.amazonaws.com/front/shared/features/slash-command-overview-v2/en-US.gif" alt="notion" width=300 height=200>
  </details>
  
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)

  > Workers is going to be our execution environment where we are goint to run `worker.js` code and serve out our Notion content on a subdomain provided by Cloudflare (`subdomain.domain.workers.dev`) or a personalized domain of our choosing

--- ---

## Steps
> **Prerequisites:** Set up your Notion page (make it *public*) and register at Cloudflare

- Let's look at **our goal** first : We want to <ins>serve the Notion page</ins> we created when people to <ins>come to our website or the *.workers.dev* subdomain</ins>
  
 - So, let's look into the documentation for [serving another site](https://developers.cloudflare.com/workers/examples/respond-with-another-site):
    ```javascript
    addEventListener("fetch", event => {
    return event.respondWith(
      fetch("https://youtube.com")
    )
    })
    ```
    *Anyone who comes to our site, should be served the YouTube home page!*
    
    **Let's see if that works?**
    
    <details>
    <summary> Look ma, I built youtube!</summary>
    <p></p>
    <p>Interestingly, it's being served out of Singapore, because that's where my closest Cloudflare server is.</p>
    <img src="https://s3.us-west-2.amazonaws.com/secure.notion-static.com/152dfe5b-a643-4f0e-acf9-d968b85062eb/Capture.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20201030%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20201030T165918Z&X-Amz-Expires=86400&X-Amz-Signature=6a3ad3a4b16d78e32e46a0d035d8659048cfaee495b80184256e96f53e575afa&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Capture.png%22" width=500 height=300>
    </details>
    
 - Ok, that works! But, that means we are done, right?
 
   We can just replace `youtube.com` with <ins>our Notion public page</ins>, and *voila!*
   
 - Nah, Unfortunately that doesn't work! 
 
   *(or fortunately rather, otherwise there is not much point in creating this whole post!)*
    
    So, if we do a [`view-source`](view-source:https://www.notion.so/) of Notion home page, we see:
    ```html
    <script type="text/javascript" src="/app-1ae08b9f66e81e1cf0c9.js"></script></body></html>
    ```
    
    Yeah, that's a *relative reference* - and <ins>when we serve out our blog, it's not gonna find it!</ins>
    
  - But, I know! Let's just replace these with **absolute references!**
  
    We are already using `javascript`, a little bit of [`regular expression` magic](https://regex101.com/r/hP2NSw/2/) and we are done, right?
    
    ```javascript
    const regex = /(?<=(href|src)=\")/gm;
    const subst = `https://www.notion.so`;
    const new_result = results.replace(regex, subst);
    ```
  - Well, not exactly!
  
    You see, we have something called a [**`content-security-policy` violation**](https://stackoverflow.com/questions/31211359/refused-to-load-the-script-because-it-violates-the-following-content-security-po)
    
    It's basically just that our domain , quite justifiably, doesn't want to run a <ins> random javascript it gets from Notion! </ins>
    
    > And security wise, that's a great thing! You wouldn't want your browser to run arbitrary javascript anyway!
    
  - Yeah, but, **we know what we are doing!, right?** Let's edit the *csp*:
    
    ```javascript
    let csp = response.headers.get('content-security-policy')
    let new_csp = csp.replaceAll("'self'", "'self' https://www.notion.so")
    new_response.headers.set('content-security-policy',new_csp)
    ```
    
  - Ok, so, we have gone through quite a many hoops. At least, now tell me that we are done?
  
    Well, not exactly! But, we are **close!**
    
    But, first, the hurdle we face : we are now greeted with a `Mismatch between origin and baseUrl (dev).` pop-up!
    
    And it's actually a little but **dense** function in the `app-1ae08b9f66e81e1cf0c9.js` we saw before:
    
    ```javascript
    didMount(){const{device:e}=this.environment;"external"===Object(m.l)  ({url:window.location.href,isMobile:e.isMobile,baseUrl:g.default.baseURL,protocol:g.default.protocol,currentUrl:window.location.href}).name&&Ve.showDialog({message:"Mismatch between origin and baseUrl (dev).",showCancel:!1,keepFocus:!1,items:[{label:n.createElement(o.FormattedMessage,{defaultMessage:"Okay",id:"notionAppContainer.dialog.mismatchedOriginURL.okayButton.label"}),onAccept:()=>{const e=xi.j({relativeUrl:xi.f(window.location.href),baseUrl:g.default.baseURL}),t=xi.e(e);t.protocol=xi.e(window.location.href).protocol,window.location.href=xi.b(t)}}]})}
    ```
    
 - **Sidebar:**
 
   Frankly, intensely trying to solve this puzzle for the last *2 days* has been pretty rewarding.

   I had learnt a little bit of `javascript` when I was starting out - but, by now I had forgotten most of it.

   So, my knowledge of `js` increased **exponentially** in these 2 days!

   But, I was <ins>ultimately trying to solve a problem, not trying to learn the language</ins>

   > Yet, unfortunately it seemed like I would need to delve much deeper into this!
 
- **Fortunately, that's when I came across [fruition](https://github.com/stephenou/fruitionsite)**
  > Yes, finally we are at the **TL;DR** part!
  
  > Aren't you happy that there was a TL;DR so you could just glean that and get on with your life!
  
  **Turns out all we need to do is to download the `.js` files so that it can be served from our blog, and then `redirect` the request to the link that we want!**
  
  Adapting the [code](https://github.com/partham16/notion-cloudflare/blob/main/worker.js) was pretty easy (except for a minor [glitch](https://github.com/stephenou/fruitionsite/issues/58))
  
  All you need to do is to get the code above and edit the configuration here:
  
  ```javascript
  /* Step 1: enter your domain name like fruitionsite.com */
  // either custom domain or cloudflare one
  const MY_DOMAIN = '*.workers.dev';
  
  /*
   * Step 2: enter your URL slug to page ID mapping
   * The key on the left is the slug (without the slash)
   * The value on the right is the Notion page ID
   */
  const SLUG_TO_PAGE = {
    // home page - // add 'page name': 'notion id' for more
    'demo': '0d44ee0e01944fabbb047c7bb9f885fd',
    '': '1d44ee0e01944fabbb047c7bb9f885fd'
  };
  ```
  
  There are a few more things you can change like the `PAGE_TITLE` or `FONT` or any `CUSTOM_SCRIPT` you may have.
  
  But, even without making those changes, you will be able to have a blog / portfolio / show-case deployed in no time!
   
    
    
