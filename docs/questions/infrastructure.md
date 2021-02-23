# Infrastructure

## What do I need to run Piral?

Some static storage (e.g., via Azure Blob Storage, Amazon S3, Dropbox, ... your own web server) is sufficient to get started.

---------------------------------------

## Do I need a Feed Service?

We have a public feed service online that you can use to get started. If you want to use this service for production purposes you should contact us.

---------------------------------------

## How can I make my own Feed Service?

We have a [specification](../specs/feed-api-specification.md) online. Also a [sample using Node.js](https://github.com/smapiot/sample-pilet-service) is available. In case you need more we also offer our consulting services. Just [contact us](https://smapiot.com/contact) for more details.

---------------------------------------

## How to configure my webserver for my Piral instance?

The configuration of your web server should be as for any SPA. Just make sure that all not found URLs point to the *index.html* of your Piral instance.

---------------------------------------

## How to configure Netlify to run Piral?

In order to configure the 404 not found redirects for netlify.com you'll need to provide a file called `_redirects` with the following content:

```plaintext
/*    /index.html   200
```

---------------------------------------

## How to configure Apache to run Piral?

In order to configure the 404 not found redirects for an Apache webserver you'll need to provide a file called `.htaccess` with the following content:

```plaintext
RewriteEngine On
RewriteCond %{SERVER_PORT} 80
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-l
RewriteRule . /index.html [L]

ErrorDocument 404 /
```

---------------------------------------

## Is the feed service reliable?

The feed service is as reliable as you build it. If you are concerned about your feed service going down we recommend using multiple instances located at different data centers. Another option is to provide a CI build to include a static feed service response in your delivered HTML or JS. That way you can always fall back to a known configuration.

Our feed service is reliable up to a certain degree. For the free community edition we don't give out any SLA. The paid enterprise edition has a SLA - just get in touch with us for details.

We will not shut down the free community edition. Also any planned changes to the infrastructure will be announced ahead of time (at least two weeks).

---------------------------------------

## How to pass environment specific variables to Piral instance?

There are multiple options:

1. Rebuild and hard-wire for each environment (e.g., resolve env variables during build).
2. Take values from index.html and change index.html dynamically per environment (e.g., via env variables or via some server settings). You could also post-build this per environment (one general bundle build across all environments, but then one more lightweight post-build per environment), but this is most efficient with a server (e.g., express) that just manipulates the index.html on the fly before sending it back.
3. Take a convention, e.g., if your app sits on app.example.com then it will on the fly use feed.examples.com. If then (in another env) you use app-stage.example.com it would automatically determine feed-stage.example.com. The beauty of this approach is that it is implicit, the downside is that you need to be aware of your convention and teach the frontend about it.
4. Likewise, you could have a path-based redirect on your server. So just use /feed for your feed and proxy/feed to https://wherever-your-feed-is.com/... in the backend. The advantage here is that this gives you flexibility per env, but has a higher infrastructure cost. Another benefit is that there is for sure no CORS issue.

All other options are usually variations of this.
