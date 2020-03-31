# Piral Feed Service API Specification

## Abstract

The Piral Feed Service API represents a RESTful API that is used for publishing and retrieving pilets.

## Introduction

The Piral Feed Service API is usually implemented and available as part of a pilet feed service, which supports publishing or retrieving pilets. To allow the Piral CLI (or any other "standard" application) to publish pilets, a certain format needs to be specified. Likewise, a standard Piral instance should be capable of retrieving pilets for the user from a backend.

Besides the core functionality of publishing and retrieving pilets, the Piral Feed Service API may also include an extended API conformance, which is used to provide alignment with some standard pilets e.g., for managing features or providing user information.

## Conformance

As well as sections marked as non-normative, all authoring guidelines, diagrams, examples, and notes in this specification are non-normative. Everything else in this specification is normative.

The key words *MAY*, *MUST*, *MUST NOT*, *OPTIONAL*, *SHOULD*, and *SHOULD NOT* are to be interpreted as described in [RFC2119](https://tools.ietf.org/html/rfc2119).

## Glossary

**API**: Application Program Interface

**Pilet**: A module for transporting features into a Piral instance

## Core API Design

The core API design includes everything that is necessary to publish pilets to the service handling the pilets or to retrieve them with a client. There is no (standardized) additional management (e.g., feature flags) in context with handling the pilets.

Implementations that are Piral conform must implement at least the core API design. Throughout the specification, the officially supported online version of the feed service ([feed.piral.cloud](https://feed.piral.cloud)) is used as a reference example.

### Publishing Pilets (Service Facing)

A pilet feed service must provide an endpoint for publishing a pilet. By default, `/api/v1/pilet` is used. However, the exact path can be also adjusted as required to fit into an existing API / endpoint design.

#### Endpoint

The endpoint needs to accept a `POST` request using basic authentication with an `Authorization` header. Other ways of authentication may be implemented as well. The value of the basic authentication is an API key that can be fully decided by the implementation. We recommend using a base64 encoded value here.

The payload of the `POST` request is form encoded with the content type `multipart/form-data`. There is a single entry named `file` transporting the contents of a file with the name *pilet.tgz*, which represents a Pilet tar ball (i.e., an NPM package). The content detail of this file is explained in the Pilet Specification (see references).

**Request**

Consider the following example:

```http
POST /api/v1/pilet
Content-Type: multipart/form-data;boundary="boundary"
Authorization: Basic YWxhZGRpbjpvcGVuc2VzYW1l

--boundary
Content-Disposition: form-data; name="file"; filename="pilet.tgz"

<tgz-content>
```

**Success Response**

In case of a successful upload, the HTTP response code has to be `200`. The exact response content is arbitrary. An empty response is valid.

**Error Response**

In case of a failed authentication, the HTTP response status code has to be `401`. In case of a bad request (e.g., missing a `file` entry, or uploading an invalid file) the HTTP status code has to be `400`. The error message should be transported via the status text.

The exact response content may be defined by the implementation (e.g., could be a JSON message with an `error` field describing a potential error).

### Retrieving Pilets (User Facing)

The service is required to expose an endpoint for retrieving pilets. Our *recommendation* is to use the same path as in the endpoint for publishing pilets (service facing), i.e., `/api/v1/pilet`. Depending on the exact implementation, a different endpoint may be used.

#### Endpoint

The service exposes a REST endpoint, which accepts a `GET` request from the client. It is recommended to authorize access to this endpoint, e.g., via a token provided in the `Authorization` header. Optionally, the provided credentials for authorizing the request can be used to tailor the list of pilets returned to the calling client.

**Request**

Consider the following example:

```http
GET /api/v1/pilet
Content-Type: application/json
```

Arbitrary headers and query parameters may be transported. The evaluation of these parameter is implementation specific and could be used for evaluation of feature flags or authorization purposes.

**Success Response**

The API interface for retrieving pilets returns a resource in JSON format. The response contains a list of pilet metadata and is defined as follows (typed as `PiletApiResponse`):

```ts
interface PiletApiResponse {
  items: Array<PiletMetadata>;
}

interface PiletMetadata {
  name: string;
  version: string;
  author: {
    name?: string;
    email?: string;
  };
  hash: string;
  content?: string;
  link?: string;
  requireRef?: string;
  custom?: any;
}
```

The schema is written and defined using a TypeScript interface (see references).

If you want to embed the JavaScript then you must use `content` *instead* of an URL in `link`.

If the `requireRef` field is used then the `content` will be embedded via a `currentScript`-based mechanism. The `requireRef` describes the name of the global require function, which must be pilet specific and should be unique across all pilets. For more information on the `requireRef` have a look at the pilet specification.

The `custom` field can be used to transport any custom data into your Piral instance. This can be helpful for some fixed constants, translations, or some other relevant information.

**Error Response**

This endpoint should always succeed. In case of urgent server issues a response with HTTP status code `500` has to be served.

In any other case an empty `items` array is suitable to indicate that no pilets are to be served.

## Examples

A working sample feed service exists and can be viewed at [github.com/smapiot/sample-pilet-service](https://github.com/smapiot/sample-pilet-service). The provided version represents a good starting point to see a Node.js express-based service implementing this specification.

The crucial points following this specification are:

### Definition of Endpoints

```js
const piletPath = `/api/v1/pilet`;

app.get(piletPath, getLatestPilets());
app.post(piletPath, checkAuth(apiKeys, 'publish-pilet'), publishPilet(rootUrl));
```

### Retrieving the Latest Pilets

```js
const getLatestPilets = () => async (_, res) => {
  const items = await latestPilets();
  return res.json({
    items,
  });
};
```

### Publishing a New Pilet

```js
const publishPilet = (rootUrl) => (req, res) => {
  const bb = req.busboy;

  if (bb) {
    req.pipe(bb);
    bb.on('file', async (_, file) => {
      try {
        const meta = await getPiletDefinition(file, rootUrl);
        await storePilet(meta);
        res.status(200).json({});
      } catch {
        res.status(400).json({});
      }
    });
  } else {
    res.status(400).json({});
  }
};
```

### Reading a Pilet

This part is more complicated. In a nutshell it looks as follows:

```js
function getPiletDefinition(stream, rootUrl) {
  return untar(stream).then(files => {
    const data = getPackageJson(files);
    const path = getPiletMainPath(data, files);
    const root = dirname(path);
    const file = basename(path);
    const main = getContent(path, files);
    const meta = extractPiletMetadata(data, main, file, files, rootUrl);
    return {
      meta,
      root,
      files,
    };
  });
}
```

The *package.json* is retrieved from the unpacked files like that:

```js
const packageRoot = 'package/';

function getPackageJson(files) {
  const fileName = `${packageRoot}package.json`;
  const fileContent = files[fileName];
  const content = fileContent.toString('utf8');
  return JSON.parse(content);
}
```

The main path is retrieved by a lookup using the following implementation:

```js
function getPiletMainPath(data, files) {
  const paths = [
    data.main,
    `dist/${data.main}`,
    `${data.main}/index.js`,
    `dist/${data.main}/index.js`,
    'index.js',
    'dist/index.js',
  ];
  return paths.map(filePath => `${packageRoot}${filePath}`).filter(filePath => !!files[filePath])[0];
}
```

An officially supported online version can be found at [piral.cloud](https://www.piral.cloud). This version does not have its source code available publicly.

## Limitations

The Feed Service API specification only deals with the `GET` and the `POST` endpoint for pilets. It does not deal with the features that use pilets or the model used by the feed service. It also does not deal with the API key management.

We recommend using a model that distinguishes between **features** and **pilets**. A feature has multiple pilets, where every pilet has the same name, but a different version. A feature may select which pilet is active and under what conditions this pilet may be shown to an end user. The specific rules for each feature are also not part of this specification.

## Acknowledgements

This specification was created by [smapiot](https://smapiot.com).

The initial author was [Florian Rappl](https://twitter.com/FlorianRappl). The review was done by [Lothar Schöttner](https://smapiot.com). Suggestions from [Jens Thirmeyer](https://www.iotcloudarchitect.com) have been taken into consideration.

## References

- [RFC2119](https://tools.ietf.org/html/rfc2119)
- [Pilet Specification](https://docs.piral.io/reference/specifications/pilet)
- [TypeScript Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)
