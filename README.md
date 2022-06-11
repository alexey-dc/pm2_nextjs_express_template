# About
This is a NextJS+ExpressJS integration that relies on [PM2](https://pm2.keymetrics.io/) as the launcher, enabling (rolling) zero-downtime deploys through its cluster mode.

For a more barebones and less opinionated template, which simply combines NextJS+ExpressJS - see [the original project](https://github.com/alexey-dc/nextjs_express_template), which has more information on the motivation behind the underlying setup.

Other than PM2, this project also pulls in [log4js](https://www.npmjs.com/package/log4js) - specifically because it's difficult to integrate logging with pm2.

Also, since proper PM2 integration involves graceful setup and teardown, this template makes an opinionated choice regarding how that should be done. Instead of a database connection, there's an in-memory datastore which pretends to need async setup. It's exposed through a namespaced global, and initialized and torn down as part of the PM2 lifecycle.

There's a tutorial for this project, which can be found here https://dev.to/alexeydc/express-nextjs-sample-tutorial-integration-485f

For the previous tutorial, which explains the basic NextJS+ExpressJS setup, see https://dev.to/alexeydc/express-nextjs-sample-tutorial-integration-485f

# Before running
The project relies on the `dotenv` package, so you'll need to create a `.env`. It's common to place secrets in `.env` - so it is `.gitignore`d in this project. A `.env-example` is provided with the barebones setup that does not require any secrets. It's a good starting point, so you can do:

```bash
cp .env-example .env
```

Redundantly, here's an example of `.env` contents for this project:
```bash
NODE_ENV=development
DEPLOY_ENV=development
EXPRESS_PORT=4444
```

# Running
`pnpm-lock.yaml` is commited, so the default way to run this project is with `pnpm`. See https://pnpm.io/installation if you're not already using it.

```bash
# For pnpm vs yarn vs npm, see https://pnpm.io/benchmarks
pnpm install
# Basic startup
pnpm start
# For local development. Enables watch mode that automatically reloads on changes to the backend
pnpm local
# To see log output,
pm2 logs pm2_nextjs_express
```

Since this project uses pm2, it can be gracefully reloaded without downtime:
```bash
pnpm reload
```

To shut down,
```bash
pnpm stop
```

There's also a debug mode, which is launched under its own pm2 name. It doesn't tear down as well, so can cause issues with relaunching and running the normal mode.
```bash
# Relies on the node debugger https://nodejs.org/en/docs/guides/debugging-getting-started/
# (which is e.g. compatible with chrome://inspect - or see the doc for other options of connecting)
pnpm debug
# To see log output,
pm2 logs pm2_nextjs_express_debug
# To stop debuger
pnpm stop_debug
```

# HTTP vs HTTPS
The code is set up to easily run local HTTP or HTTPS.

If you're debating which one to use for yourself, here is a good article that helps establish a decision boundary:
https://web.dev/when-to-use-local-https

For example, you may have to use a custom local hostname if you're working OAuth - some OAuth providers don't allow using localhost as a redirect URL (e.g. [PayPal does not allow this](https://stackoverflow.com/questions/14436483/setting-paypal-return-url-to-localhost)).

## Localhost HTTP
If you just run the code as-is, it will run on HTTP, no additional changes or setup necessary.

## Localhost HTTPS
To enable HTTPS locally, you'll need to change line 32 in `app/server.js`:
```javascript
// Before
this.server = httpServer(this.express)
// After
this.server = httpsServer(this.express)
```

One of the easiest ways to use HTTPS locally is with mkcert. It's really simple:

```bash
# 1. Install mkcert
# Mac
brew install mkcert
brew install nss      # for Firefox
# Linux: https://github.com/FiloSottile/mkcert#linux
mkcert -install

# 2. Issue certificates
mkdir mkcert          # Inside the root of this project
cd mkcert
mkcert localhost
```

Then set environment variables for your new cert:
```bash
# 3. Add certificate to a .env file at the root of this project
SSL_PRIVATE_KEY_PATH = mkcert/localhost-key.pem
SSL_CERTIFICATE_PATH = mkcert/localhost.pem
```

If you want to run tests against your API outside the browser, you'll want the additional setup steps below.

### Running tests with local HTTPS (not necessary to run this project)
Even though mkcert certificates are a step up from being self-signed, since there's a self-issued certificate authority that signed them, the CA (Certificate Authority) is not recognizable by standard HTTPS clients (e.g. via `fetch` or node's `https` module): they will error out with `UNABLE_TO_VERIFY_LEAF_SIGNATURE`, saying `Error: unable to verify the first certificate`.

To bypass this, a client can be told to accept certificates issued by a certain certificate authority. CAs are identified via public keys: each certificate issued by a CA is signed with its private key.

So we need to pass the public key into the client, to let them know to trust that CA; `fetch` and `https` both support this via the `{ca: public_key_aka_certificate}` option.

Now we just need to find where mkcert put the certificates for its CA:
```bash
mkcert -CAROOT
```

E.g. on a mac it will print something like:
```bash
/Users/alexey/Library/Application Support/mkcert
```
Which has
```bash
% ls '/Users/alexey/Library/Application Support/mkcert'
rootCA-key.pem rootCA.pem
```

`rootCA.pem` is the certificate (you can figure that out because it's not being called a key). Either set the `SSL_ROOTCA_PATH` to the global path, or copy the certificate into the `mkcert` directory - since it's not committed anyway, and use that path in your .env:

```bash
cp '/Users/alexey/Library/Application Support/mkcert/rootCA.pem' 'mkcert/rootCA.pem'
# The add this to your .env
SSL_ROOTCA_PATH = mkcert/rootCA-key.pem
```

