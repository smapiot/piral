---
title: Pilet Metadata
description: The metadata defined for a pilet in its package.json.
section: Customization
---

# Pilet Metadata

The Piral CLI uses the *package.json* file, as well as an optional *pilet.json* file for retrieving useful information. This includes the specific Piral instance to use or the shared dependencies to be used in pilets.

## Package Definition

The *package.json* might contain information about shared dependencies.

```json
{
  "name": "my-awesome-pilet",
  // ...
  "importmap": {
    "imports": {},
    "inherit": []
  }
}
```

If inherited directly or indirectly from a Piral instance the dependencies won't be built and provided as a side bundle. All other dependencies mentioned in the `imports` or not referenced from a Piral instance will be provided as shared dependencies with a side bundle in case no other pilet has loaded these already.

The optional *pilet.json* contains information such as:

```json
{
  "schemaVersion": "v2",
  "piralInstances": {
    "my-piral-instance": {
      "selected": true
    }
  }
}
```

where the `schemaVersion` indicates the schema to use for the pilet. The pilet will then be built using the given schema. This can still be changed by providing an explicit command line argument.

The indicated `piralInstances` are all the Piral instances that can be used for debugging the pilet.

## Legacy Definitions

The legacy fields for a pilet package (*package.json*) are as follows:

```json
{
  "name": "my-awesome-pilet",
  // ...
  "peerDependencies": {
    "react": "*"
  },
  "peerModules": [
    "react-dom/server"
  ],
  "piral": {
    "comment": "Keep this section to use the Piral CLI.",
    "name": "my-piral-instance"
  }
}
```

The name of the Piral instance is used to find the right entry point for debugging.

The `peerDependencies` represent the list of shared dependency libraries, i.e., dependencies treated as external, which are shared by the application shell. The `peerModules` represent the list of shared dependency modules, i.e., modules treated as external, which are shared by the application shell.

**Remark**: The `piral` field is exclusively used by the Piral CLI. For information regarding what might be picked up by a feed service implementation see the specification of a pilet, which discusses all fields in depth.
