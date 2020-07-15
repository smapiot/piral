---
title: Piral Inspector
---

# Piral Browser Extension

## Introduction

To optimally work as a developer with your piral instance, and all of its containing pilets, Piral Inspector offers a great set of capabilities:
- Getting information about the currently running Piral instance, e.g. name and version
- Overview on currently loaded Pilets
- Adding / Removing of pilets on-the-fly
- Overview of registered routes
- Collection of emitted events
- Collection of global states

As a developer of your piral instance, or your pilets, you are used to working with a web browser. And this is precisely the best place to get assisted by the Piral Inspector during the development or testing phase.

We provide the Piral Inspector as an extension for the following browsers:
- Google Chrome (>= v50)
- Firefox (>= v50)
- Opera (>= v50)


## Installation of add-on / extension

### Firefox

Type the following URL into the browser address line followed by hitting enter:
```
about:addons
```

On the following page, you can ```search for "Piral Inspector"```, and you will see the add-on as the first result:

![FirefoxAddOnSearchResultPiralInspector](../diagrams/piralinspector_firefox_add-on_searchresult.png)

Click on ```"Piral Inspector"```.

On the following details page, click on ```"Add to Firefox"```:
 
![FirefoxAddOnAddToFirefoxPiralInspector](../diagrams/piralinspector_firefox_add-on_add.png)

Now, a security message will appear, please click on ```"Add"``` to accept the required security settings:

![FirefoxAddOnSecurityMessagePiralInspector](../diagrams/piralinspector_firefox_add-on_security.png)

Piral Inspector is now available, and you can open it via the Web Developer Tools (```Tools > Web Developer > Toggle Tools```).

On the tools bar, there now will also appear the ```Piral``` icon, and with a click on it, you will see the initial "Not connected" page. 

In case you are currently running a Piral instance in debug mode, you will see the available Pilets and registered routes.

![FirefoxAddOnToolPiralInspector](../diagrams/piralinspector_firefox_add-on_tool.png)


### Google Chrome

Type the following URL into the browser address line followed by hitting enter:
```
https://chrome.google.com/webstore/category/extensions
```

On the following page, you can ```search for "Piral Inspector"```, and you will see the add-on as the first result.

Click on ```"Add to Chrome"```.
 
![GoogleChromeExtensionAddToChromePiralInspector](../diagrams/piralinspector_chrome_add-on_searchresult.png)

Now, a security message will appear, please click on ```"Add extension"``` to accept the required security settings:

![GoogleChromeExtensionSecurityMessagePiralInspector](../diagrams/piralinspector_chrome_add-on_security.png)

Piral Inspector is now available, and you can open it via the Developer Tools (```View > Developer > Developer Tools```).

On the tools bar, there now will also appear the ```Piral``` icon, and with a click on it, you will see the initial "Not connected" page. 

In case you are currently running a Piral instance in debug mode, you will see the available Pilets and registered routes.

![GoogleChromeExtensionToolPiralInspector](../diagrams/piralinspector_chrome_add-on_tool.png)


### Opera

Type the following URL into the browser address line followed by hitting enter:
```
addons.opera.com/extensions
```

On the following page, you can ```search for "Piral Inspector"```, and you will see the add-on as the first result.

Click on ```"Add to Opera"```.
 
![OperaExtensionAddToOperaPiralInspector](../diagrams/piralinspector_opera_add-on_searchresult.png)

Now, a security message will appear, please click on ```"Add extension"``` to accept the required security settings:

![OperaExtensionSecurityMessagePiralInspector](../diagrams/piralinspector_chrome_add-on_security.png)

Piral Inspector is now available, and you can open it via the Developer Tools (```Developer > Developer Tools```).

On the tools bar, there now will also appear the ```Piral``` icon, and with a click on it, you will see the initial "Not connected" page. 

In case you are currently running a Piral instance in debug mode, you will see the available Pilets and registered routes.

![OperaExtensionToolPiralInspector](../diagrams/piralinspector_chrome_add-on_tool.png)


## Using Piral Inspector

Piral Inspector offers a wide variety of capabilities regarding Piral instance and its corresponding Pilets.

The add-on/extension operates on a ```locally in debug mode running Piral instance```, and it directly interacts with it.

The following sections are shown inside the extension:
- Information about Piral instance
- Available Pilets
- Add Pilets
- Registered Routes
- Events
- State Container

All of these sections will documented in the following chapters:

### Piral instance
In the very left top, the extension shows the name and the version of the currently running Piral instance.
Besides that, in the very right top, a click on the icon allows the user to adapt the extension's settings to its needs.

![PiralInstanceToolPiralInspector](../diagrams/piralinspector_tool_piralinstance.png)

In the debug setting, the user can activate/deactivate the following options:
![DebugSettingsToolPiralInspector](../diagrams/piralinspector_tool_debugsettings.png)

#### State Container Logging
Activates/Deactivates the logging of changes in the state container to the Developer Tools console.

#### Load available Pilets
Activates/Deactivates the loading of the available Pilets.
> This option is only available when the user is debugging a Pilet.

#### Full refresh on change
Refreshes the current browser page in case there was a change in the debugged Pilet.
> This option is only available when the user is debugging a Pilet.

#### Visualize component origins
Activates the option to visualize the origin of the modules as another icon in Piral instance section:

![DebugSettingsVisCompOriginToolPiralInspector](../diagrams/piralinspector_tool_visualizecomponentoriginicon.png)

After clicking on the icon, the origin of each single tile will be displayed:

![DebugSettingsVisCompOriginToolPiralInspector](../diagrams/piralinspector_tool_visualizecomponentorigintile.png)

The origin will also be displayed when hovering over a tile.


### Available Pilets
The Piral Inspector lists all the currently available Pilets. Like illustrated in the table below.

![AvailablePiletsToolPiralInspector](../diagrams/piralinspector_tool_availablepilets.png)

By clicking on the switch button on the left, the user can activate and deactivate each Pilet.

With a click on the "X" on the right, the user can remove each Pilet individually.

### Add Pilets
There are two options to load additional Pilets into the currently running Piral instance:

#### Add a feed address
Enter a feed address into the text field and click on the ```"Add"``` button.
In case you chose a feed you have access to, the corresponding Pilets will be loaded and shown in the tile section and the list of available Pilets. Per default, the new Pilets will be active.

#### Bundle local Pilet and upload it
First, you need to ```"Browse"``` to the Pilet package file and then ```"Upload"``` it.
In case you uploaded a proper Pilet, it will be loaded and shown in the tile section and the list of available Pilets. Per default, the new Pilet will be active, but will be given a random name.
> The Pilet will be loaded into a temporary feed, and this feed (including the Pilets) will be removed when the predefined lifetime (default 60 minutes) expires.

![AddPiletsToolPiralInspector](../diagrams/piralinspector_tool_addpilets.png)

### Registered Routes
This section shows all currently registered routes, and with a click on a single one, it will call the route.

![RegisteredRoutesToolPiralInspector](../diagrams/piralinspector_tool_registeredroutes.png)

In case the route needs one or more input parameters, a dialog will appear, and the user can provide the required information.

![RegisteredRoutesParameterToolPiralInspector](../diagrams/piralinspector_tool_registeredroutespara.png)

### Events
All events which occurred since the last refresh of the page are collected and shown in this section.

![EventsToolPiralInspector](../diagrams/piralinspector_tool_events.png)

Besides that, the user can emit a new event:

![EmitEventToolPiralInspector](../diagrams/piralinspector_tool_emitevent.png)

### State Container
The final section shows the currently available global state (read-only) for the following topics:

![StateContainerToolPiralInspector](../diagrams/piralinspector_tool_statecontainer.png)

#### app
It shows the state of loading and the currently chosen layout, e.g. mobile.

#### modules
This subsection shows all loaded modules. With a click on each one, the details will be shown like in the following example:

![StateContainerExampleToolPiralInspector](../diagrams/piralinspector_tool_statecontainerexample.png)

#### search
It merely shows the last entered search input string.

#### language
This subsection shows the currently selected language and available languages.

#### feeds
It shows the currently used feeds, and provide details by clicking on the single data.
