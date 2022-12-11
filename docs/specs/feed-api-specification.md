---
title: Piral Feed Service API Specification
---

# Piral Feed Service API Specification

## Abstract

The Piral Feed Service API represents a RESTful API that is used for publishing and retrieving pilets.

## Introduction

The Piral Feed Service API is usually implemented and available as part of a pilet feed service, which supports publishing or retrieving pilets. To allow the Piral CLI (or any other "standard" application) to publish pilets, a certain format needs to be specified. Likewise, a standard Piral instance should be capable of retrieving pilets for the user from a backend.

Besides the core functionality of publishing and retrieving pilets, the Piral Feed Service API may also include extended API conformance, which is used to provide alignment with some standard pilets e.g., for managing features or providing user information.

## Conformance

As well as sections marked as non-normative, all authoring guidelines, diagrams, examples, and notes in this specification are non-normative. Everything else in this specification is normative.

The keywords *MAY*, *MUST*, *MUST NOT*, *OPTIONAL*, *SHOULD*, and *SHOULD NOT* are to be interpreted as described in [RFC2119](https://tools.ietf.org/html/rfc2119).

## Glossary

**API**: Application Program Interface

**Pilet**: A module for transporting features into a Piral instance

## Core API Design

The core API design includes everything necessary to publish pilets to the service handling the pilets or to retrieve them with a client. There is no (standardized) additional management (e.g., feature flags) in context with handling the pilets.

Implementations that are Piral conform must implement at least the core API design. Throughout the specification, the officially supported online version of the feed service ([feed.piral.cloud](https://feed.piral.cloud)) is used as a reference example.

### Publishing Pilets (Service Facing)

A pilet feed service must provide an endpoint for publishing a pilet. By default, `/api/v1/pilet` is used. However, the exact path can be also adjusted as required to fit into an existing API / endpoint design.

#### Endpoint

The endpoint needs to accept a `POST` request using basic authentication with an `Authorization` header. Other ways of authentication may be implemented as well. The value of the basic authentication is an API key that can be fully decided by the implementation. We recommend using a base64 encoded value here.

The payload of the `POST` request is form encoded with the content type `multipart/form-data`. There is a single entry named `file` transporting the contents of a file with the name *pilet.tgz*, which represents a Pilet tarball (i.e., an npm package). The content detail of this file is explained in the Pilet Specification (see references).

Other entries besides `file` may be used, too. These can be determined by implementation-dependent requirements. The `piral-cli` supports filling these fields via the `--fields[field]` flag, followed by a value, e.g., `--fields.tag next`.

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

In case of a bad request (e.g., missing a `file` entry, or uploading an invalid file) the HTTP status code has to be `400`. This is also true if, e.g., the `name` does not match an expected format.

In case of a failed authentication, the HTTP response status code has to be `401`.

In the case of an app-store-like feed service, the feed may reject pilets in case of missing fees. In such scenarios, the response should be `402`.

In case of accepted authentication, but insufficient rights the HTTP response status code has to be `403`.

In case of an existing entry (name and version are already there), the HTTP status has to be `409`.

In the case where a pilet exceeds the limits defined by the feed service (e.g., pilet is 18 MB but the feed only accepts up to 16 MB) the HTTP status has to be `413`.

The error message should be transported via the status text. The exact response content may be defined by the implementation (e.g., could be a JSON message with an `error` field describing a potential error).

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

Arbitrary headers and query parameters may be transported. The evaluation of these parameters is implementation-specific and could be used for the evaluation of feature flags or authorization purposes.

**Success Response**

The API interface for retrieving pilets returns a resource in JSON format. The response contains a list of pilet metadata and is defined as follows (typed as `PiletApiResponse`):

```ts
interface PiletApiResponse {
  items: Array<PiletMetadata>;
}

interface PiletMetadataV0 {
  name: string;
  version: string;
  content?: string;
  link?: string;
  hash: string;
  noCache?: boolean | string;
  custom?: any;
  config?: Record<string, any>;
  dependencies?: Record<string, string>;
}

interface PiletMetadataV1 {
  name: string;
  version: string;
  link: string;
  requireRef: string;
  integrity?: string;
  custom?: any;
  config?: Record<string, any>;
  dependencies?: Record<string, string>;
}

interface PiletMetadataV2 {
  name: string;
  version: string;
  link: string;
  requireRef: string;
  integrity?: string;
  spec: 'v2';
  custom?: any;
  config?: Record<string, any>;
  dependencies?: Record<string, string>;
}

type PiletMetadata = PiletMetadataV0 | PiletMetadataV1 | PiletMetadataV2;
```

The schema is written and defined using a TypeScript interface (see references).

If you want to embed the JavaScript then you must follow the `PiletMetadataV0` interface and use `content` *instead* of an URL in `link`.

If the `requireRef` field is used then `PiletMetadataV1` will be used implicitly. In this case, the pilet is integrated via a `currentScript`-based mechanism. The `requireRef` describes the name of the global require function, which must be pilet specific and should be unique across all pilets. For more information on the `requireRef` have a look at the pilet specification.

In `PiletMetadataV1` the role of `hash` is replaced by an optional `integrity` field. While hash could be anything (we recommend SHA1) the `integrity` actually follows the browser specification (see references) and must be prefixed with a valid hash method (e.g., `sha384-`) followed by the base64 encoded hash.

For `PiletMetadataV2` pilets to be identified accurately the `spec` field needs to be available and set to `v2`. Otherwise, from the metadata perspective, these pilets are almost identical to `PiletMetadataV1`. The major difference is that the actual JavaScript code is conforming to SystemJS instead of UMD.

The `custom` field can be used to transport any custom data into your Piral instance. This can be helpful for some fixed constants, translations, or some other relevant information.

The `config` field can be used to transport frontend configuration to be leveraged by the specific pilet. This can be helpful to obtain things that should be easily configurable or changeable such as colors, frontend API keys (e.g., for Google Maps), or specific behavior.

The `dependencies` field can be used to provide a list of scripts that should be loaded before running the pilet. The idea is that these scripts can live on a CDN (and thus be cached efficiently) and could be potentially shared (i.e., multiple pilets using the same scripts will only load the script once).

**Error Response**

This endpoint should always succeed. In case of urgent server issues, a response with HTTP status code `500` has to be served.

In any other case, an empty `items` array is suitable to indicate that no pilets are to be served.

### Interactive Login (Service Facing)

The service can optionally expose an endpoint for an interactive login. The endpoint for the interactive login has to be specified in the body of `401` responses from the feed service - most importantly the publish pilet endpoint specified earlier.

The field `interactiveAuth` of `401` error responses is used to determine the URL for the interactive login. Calling this URL results in an object that determines the polling endpoint, the login endpoint, and the expiration date for the login.

#### Auth Endpoint

The service exposes a REST endpoint, which accepts a `POST` request from the client. With the `POST` request, a new interactive login is requested.

**Request**

Consider the following example:

```http
POST /api/v1/auth
Content-Type: application/json

{
  "clientId": "my-client",
  "clientName": "My Client",
  "description": "Describe why users should login here."
}
```

Arbitrary headers and query parameters may be transported. The evaluation of these parameters is implementation-specific and could be done to prevent arbitrary clients from triggering an interactive login.

**Success Response**

The API interface for triggering an interactive login returns a resource in JSON format. The response contains two URLs and one datetime (typed as `AuthApiResponse`):

```ts
interface AuthApiResponse {
  loginUrl: string;
  callbackUrl: string;
  expires: string;
}
```

The `loginUrl` should be opened in the browser by the user. The `callbackUrl` should be used by the client. The former represents the entry point to actually perform the login / obtain the credentials, while the latter can be used to get notified when the user successfully completed the login. The latter *should* be suitable to be used with long polling, otherwise, it will be pinged until the user aborts or the `expires` is reached.

Both URLs should be GET endpoints.

**Error Response**

This endpoint should always succeed. In case of urgent server issues, a response with HTTP status code `500` has to be served. Any non-`200` response will be treated as an error response.

#### Status Endpoint

The service exposes a REST endpoint, which accepts a `GET` request from the client. With the `GET` request, an existing interactive login is queried for its completion and the eventual result.

**Success Response**

In the case of early termination (with an indeterminate result, i.e., no error) return `202`.

In the case of successful completion (either directly or through long polling/waiting for the result) the service should respond with `200` and the following content (typed as `AuthStatusApiResponse`):

```ts
interface AuthStatusApiResponse {
  mode: 'none' | 'digest' | 'bearer' | 'basic';
  token: string;
}
```

The data from the response is used to build the `authorization` header of the requests requiring some authentication.

**Error Response**

This endpoint can fail with a `404` (in case no active authorization request has been found) or `400` (in case some required details are missing in the request). In case of urgent server issues, a response with HTTP status code `500` has to be served. Any non-`200` and non-`202` responses will be treated as error responses.

#### Login Page

The login page must be linked in the `loginUrl` of the `AuthApiResponse`. The implementation is irrelevant to this specification, but it must give the user the ability to conclude the flow. A common implementation will contain some kind of reference to the original request, e.g., an ID transported via a query parameter. This is then used to show what application initiated the request and what is the purpose of this authorization request.

The only requirement for finishing the flow is that once the user successfully logged in, the status endpoint reports a successful conclusion (and terminates all ongoing long polling requests with a successful response).

## Examples

Working feed service implementations exist and can be viewed online.

Full list of known (sample / open-source) implementations:

- [Node.js implementation](https://github.com/smapiot/sample-pilet-service) by [Florian Rappl](https://github.com/FlorianRappl)
- [Java implementation](https://github.com/scarrozzo/sample-pilet-service) by [Sergio Carrozzo](https://github.com/scarrozzo)
- [Azure Function implementation](https://github.com/smapiot/azure-function-pilet-feed) by [Waqas Ali](https://github.com/waqasali47)

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

This part is more complicated. In a nutshell, it looks as follows:

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

The Feed Service API specification only deals with the `GET` and the `POST` endpoint for pilets. It does not deal with the features that use pilets or the model used by the feed service. It also does not deal with API key management.

We recommend using a model that distinguishes between **features** and **pilets**. A feature has multiple pilets, where every pilet has the same name, but a different version. A feature may select which pilet is active and under what conditions this pilet may be shown to an end-user. The specific rules for each feature are also not part of this specification.

## Acknowledgments

This specification was created by [smapiot](https://smapiot.com).

The initial author was [Florian Rappl](https://twitter.com/FlorianRappl). The review was done by [Lothar Schöttner](https://smapiot.com). Suggestions from [Jens Thirmeyer](https://www.iotcloudarchitect.com) have been taken into consideration.

## References

- [RFC2119](https://tools.ietf.org/html/rfc2119)
- [Pilet Specification](https://docs.piral.io/reference/specifications/pilet-specification)
- [TypeScript Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)
- [Subresource Integrity](https://www.w3.org/TR/SRI/)
