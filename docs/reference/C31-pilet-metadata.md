---
title: Pilet Metadata
description: The metadata defined for a pilet in its package.json.
section: Customization
---

# Pilet Metadata

The Piral CLI uses the *package.json* file for retrieving useful information. This includes the specific Piral instance to use or the shared dependencies to be used in pilets.

## Package Definition

The additional fields for a pilet package are as follows:

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
  },
}
```

The name of the Piral instance is used to find the right entry point for debugging.

The `peerDependencies` represent the list of shared dependency libraries, i.e., dependencies treated as external, which are shared by the application shell. The `peerModules` repesent the list of shared dependency modules, i.e., modules treated as external, which are shared by the application shell.

**Remark**: The `piral` field is exclusively used by the Piral CLI. For information regarding what might be picked up by a feed service implementation see the specification of a pilet, which discusses all fields in depth.
