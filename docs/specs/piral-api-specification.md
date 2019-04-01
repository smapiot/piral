# Piral API Specification

## Abstract

(tbd)

## Introduction

(tbd)

## Conformance

As well as sections marked as non-normative, all authoring guidelines, diagrams, examples, and notes in this specification are non-normative. Everything else in this specification is normative.

The key words *MAY*, *MUST*, *MUST NOT*, *OPTIONAL*, *SHOULD*, and *SHOULD NOT* are to be interpreted as described in [RFC2119](https://tools.ietf.org/html/rfc2119).

## Examples

(tbd)

## Glossary

(tbd)

## Core API Design

(tbd)

### Pilet Feed Service

The pilet feed service needs to provide the following resources:

```graphql
type PiletMetadata
{
  id: ID!
  author: PiletAuthor
  content: String
  hash: String
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
  website: String
}

type Query
{
  pilets(hashes: [String]): [PiletMetadata]

  piletLicense(pilet: ID!): PiletLicense
}
```

## Extended API Design

(tbd)

## Limitations

(tbd)

## Acknowledgements

(tbd)

## References

(tbd)
