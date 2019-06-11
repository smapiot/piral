# Piral API Specification

## Abstract

The Piral API represents a RESTful API that is used for publishing pilets and retrieving pilets.

## Introduction

The Piral API is usually represented in terms of a pilet feed service, which is used to allow publishing a pilet or retrieving pilets. To allow the Piral CLI (or any other "standard" application) to publish pilets a certain format needs to be specified. Likewise, a standard Piral instance should be capable of retrieving pilets for the user from a backend.

Besides the core functionality of publishing and retrieving pilets the Piral API may also include an extended API conformance, which is used to provide alignment with some standard pilets such as "feature management" or "user information".

## Conformance

As well as sections marked as non-normative, all authoring guidelines, diagrams, examples, and notes in this specification are non-normative. Everything else in this specification is normative.

The key words *MAY*, *MUST*, *MUST NOT*, *OPTIONAL*, *SHOULD*, and *SHOULD NOT* are to be interpreted as described in [RFC2119](https://tools.ietf.org/html/rfc2119).

## Examples

(tbd)

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

The endpoint needs to accept a `POST` request using basic authentication with an `authorization` header. Other ways of authentication may be implemented as well. The value of the basic authentication is an API key that can be fully decided by the implementation.

The payload of the `POST` request is a form encoded using `multipart/form-data`. There is a single entry called `file` transporting the contents of a file named *pilet.tgz*, which represents a Pilet tar ball (i.e., a NPM package). The content details of this file are explained in the Pilet Specification (see references).

In case of a failed authentication the HTTP response status code has to be `401`. In case of a bad request (e.g., missing a `file` entry, or uploading an invalid file) the HTTP status code has to be `400`. The error message should be transported via the status text.

In case of a successful upload the HTTP response code has to be `200`.

The exact response may be defined by the implementation (e.g., could be a JSON message with an `error` field describing the error).

#### User Facing

The pilet feed service needs to provide the following resources to be consumed by end users:

```graphql
type PiletMetadata
{
  name: ID!
  version: String
  author: PiletAuthor
  hash: String
  link: String
  dependencies: [PiletDependency]
}

type PiletDependency
{
  name: String
  link: String
}

type PiletLicense
{
  pilet: ID!
  author: PiletAuthor
  type: String
  text: String
}

type PiletAuthor
{
  name: String
  email: String
}

type Query
{
  pilets(hashes: [String]): [PiletMetadata]

  piletLicense(pilet: ID!): PiletLicense
}
```

The schema is written as defined by the GraphQL specification (see references).

## Extended API Design

(tbd)

## Limitations

(tbd)

## Acknowledgements

(tbd)

## References

* [RFC2119](https://tools.ietf.org/html/rfc2119)
* [Pilet Specification](https://docs.piral.io/specifications/pilet)
* [GraphQL Specification](https://graphql.github.io/graphql-spec/)
