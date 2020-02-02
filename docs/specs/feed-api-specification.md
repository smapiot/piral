# Piral Feed Service API Specification

## Abstract

The Piral Feed Service API represents a RESTful API that is used for publishing pilets and retrieving pilets.

## Introduction

The Piral Feed Service API is usually represented in terms of a pilet feed service, which is used to allow publishing a pilet or retrieving pilets. To allow the Piral CLI (or any other "standard" application) to publish pilets a certain format needs to be specified. Likewise, a standard Piral instance should be capable of retrieving pilets for the user from a backend.

Besides the core functionality of publishing and retrieving pilets the Piral Feed Service API may also include an extended API conformance, which is used to provide alignment with some standard pilets such as "feature management" or "user information".

## Conformance

As well as sections marked as non-normative, all authoring guidelines, diagrams, examples, and notes in this specification are non-normative. Everything else in this specification is normative.

The key words *MAY*, *MUST*, *MUST NOT*, *OPTIONAL*, *SHOULD*, and *SHOULD NOT* are to be interpreted as described in [RFC2119](https://tools.ietf.org/html/rfc2119).

## Examples

A working sample feed service exists and can be viewed at [github.com/smapiot/sample-pilet-service](https://github.com/smapiot/sample-pilet-service). The provided version should be a good starting point to see a Node.js express-based service using this specification.

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

An officially supported online version can be found at [feed.piral.io](https://feed.piral.io). This version does not have its source code available publicly.

## Glossary

**API**: Application Program Interface

**GraphQL**: A data query and manipulation language for APIs

**Pilet**: A module for transporting features into a Piral instance

## Core API Design

The core API design includes everything that is necessary to publish pilets or retrieve them as an end-user. There is no (standardized) additional management (e.g., feature flags) on top of these pilets.

Implementations that are Piral conform must implement at least the core API design.

### Pilet Feed Service

#### Service Facing

The pilet feed service needs to provide an endpoint for publishing a pilet. By default, `/api/v1/pilet` is used, however, the exact path can be also adjusted to fit into an existing API / endpoint design.

The endpoint needs to accept a `POST` request using basic authentication with an `Authorization` header. Other ways of authentication may be implemented as well. The value of the basic authentication is an API key that can be fully decided by the implementation. We recommend using a base64 encoded value here.

The payload of the `POST` request is a form encoded using `multipart/form-data`. There is a single entry called `file` transporting the contents of a file named *pilet.tgz*, which represents a Pilet tar ball (i.e., a NPM package). The content details of this file are explained in the Pilet Specification (see references).

```http
POST /api/v1/pilet
Content-Type: multipart/form-data;boundary="boundary"
Authorization: Basic YWxhZGRpbjpvcGVuc2VzYW1l

--boundary
Content-Disposition: form-data; name="file"; filename="pilet.tgz"

<tgz-content>
```

In case of a failed authentication the HTTP response status code has to be `401`. In case of a bad request (e.g., missing a `file` entry, or uploading an invalid file) the HTTP status code has to be `400`. The error message should be transported via the status text.

In case of a successful upload the HTTP response code has to be `200`. The exact response content is arbitrary. An empty response is valid.

The exact response may be defined by the implementation (e.g., could be a JSON message with an `error` field describing a potential error).

Optional exposure with **GraphQL**.

If GraphQL is used *as an additional transport* mechanism for the feed service then it *should* provide the following resources to be consumed by services:

```graphql
type PiletMetadata {
  name: ID!
  version: String!
  author: PiletAuthor!
  hash: String!
  content: String
  link: String
  custom: JSON
}

type PiletAuthor {
  name: String
  email: String
}

type Mutation {
  publishPilet(file: Upload!): PiletMetadata
}
```

The schema is written as defined by the GraphQL specification (see references). The `Upload` type has to be defined via the multipart upload spec. An example implementation is available via the [Apollo Upload Client](https://github.com/jaydenseric/apollo-upload-client).

The connection has to be defined with the API Key in the `Authorization` header. Alternatively, some other mechanism for authorization needs to be used.

#### User Facing

Required exposure with plain **REST**.

The Piral feed service needs to provide an API interface returning a JSON response typed as `PiletApiResponse`, which is defined as follows:

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
  custom?: any;
}
```

The schema is written and defined using a TypeScript interface (see references).

As endpoint our *recommendation* is `/api/v1/pilet`. Depending on the exact implementation a different endpoint should be used. We recommend using the same path as in the service facing API endpoint (used for publishing pilets).

Optional exposure with **GraphQL**.

If GraphQL is used *as an additional transport* mechanism for the feed service then it *should* provide the following resources to be consumed by end users:

```graphql
type PiletMetadata {
  name: ID!
  version: String!
  author: PiletAuthor!
  hash: String!
  content: String
  link: String
  custom: JSON
}

type PiletAuthor {
  name: String
  email: String
}

type Query {
  pilets: [PiletMetadata]
}
```

The schema is written as defined by the GraphQL specification (see references).

## Limitations

The Feed Service API specification only deals with the `GET` and the `POST` endpoint for pilets. It does not deal with the features that use pilets or the model used by the feed service. It also does not deal with the API key management.

We recommend using a model that distinguishes between **features** and **pilets**. A feature has multiple pilets, where every pilet has the same name, but a different version. A feature may select which pilet is active and under what conditions this pilet may be shown to an end user. The specific rules for each feature are also not part of this specification.

## Acknowledgements

This specification was created by [smapiot](https://smapiot.com).

The initial author was [Florian Rappl](https://twitter.com/FlorianRappl). The review was done by [Lothar Schöttner](https://smapiot.com). Suggestions from [Jens Thirmeyer](https://www.iotcloudarchitect.com) have been taken into consideration.

## References

* [RFC2119](https://tools.ietf.org/html/rfc2119)
* [Pilet Specification](https://docs.piral.io/reference/specifications/pilet)
* [GraphQL Specification](https://graphql.github.io/graphql-spec/)
* [TypeScript Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)
