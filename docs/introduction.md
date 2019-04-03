# Introduction

Piral is a solution for frontend modularization, where the different modules can be developed independently without any binding to the host system. We call these modules *pilets*. We therefore refer to a pilet as a small module that lives inside a piral instance.

While the idea of smaller (independent) modules is not new the provided approach has some advantages (and - depending on the use-case - disadvantages) over, e.g., bundle splitting as its done in modern build systems. Actually, the given approach is not exclusive and can be used together with bundle splitting.

A pilet is not only independent of the main application (a "piral instance"), but also independently developed. This means you can give an independent development team the task to build a module in your application without requiring the same repository or infrastructure.

(tbd)
