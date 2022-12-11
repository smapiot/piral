---
title: Extension Patterns
description: How extensions can be used to create flexible frontends.
audience: Architects, Developers
level: Proficient
section: Details
---

# Extension Patterns

The extension system was designed to allow the creation of flexible frontend applications. They sit in the heart of the Piral ecosystem. One of the reasons for their power is that they are loosely coupled, which enables you to use them in various ways.

The loose coupling also comes with some challenges. Most notably, the missing typings and resilience against refactoring is something to actively tackle, e.g., via tests, conventions, and discipline.

Most often, you'll experience that the extension system can be used for much more. You'll see that in the end, you'll potentially not need to share some state or emit events when you can leverage extension components. After all, what you want in a frontend is to render something on the screen.

In this article, some patterns have been selected for inspiration and to serve as a catalogue. If you understand (and apply) these patterns they should lead you the way to efficiently use the extension component system.

## Info Placeholder

The easiest way to use extensions is to just place them where you feel extra content may be displayed in the future. Let's say you have a page displaying some machine data. It could be defined as follows:

```jsx
const MachineDataPage = ({ data }) => {
  return (
    <>
      <h1>Machine Data</h1>
      <InfoGrid>
        <InfoBox name="Weight" value={data.weight} />
        <InfoBox name="Power" value={data.power} />
        <InfoBox name="Operating Time" value={data.time} />
        <InfoBox name="License" value={data.license} />
      </InfoGrid>
    </>
  );
};
```

**Note**: In this example we omit definitions of helper components such as `InfoGrid` and `InfoBox` to focus on the extension placement alone.

Let's say we might assume that some other micro frontend might have something to contribute to this *page* (i.e., not the grid itself). We can just place an "info placeholder" extension slot, i.e., a slot that could be used for further information later on.

```jsx
const MachineDataPage = ({ data, piral }) => {
  return (
    <>
      <h1>Machine Data</h1>
      <InfoGrid>
        <InfoBox name="Weight" value={data.weight} />
        <InfoBox name="Power" value={data.power} />
        <InfoBox name="Operating Time" value={data.time} />
        <InfoBox name="License" value={data.license} />
      </InfoGrid>
      <piral.Extension name="machine-info" params={data} />
    </>
  );
};
```

Now micro frontends can come up with some more things to display on the machine data page.

## Actions Placeholder

A good way to leverage extensions is to use them as doors for pages or functionality coming from other micro frontends. Let's say we have two micro frontends:

- machine overview (A)
- edit machine data (B)

Classically, you might think that micro frontend A should have a page like this:

```jsx
const MachineOverviewPage = ({ data }) => {
  return (
    <>
      <h1>Machines</h1>
      <table>
      {data.machines.map(machine => (
        <tr key={machine.id}>
          <td>{machine.name}</td>
          <td>
            <Link to={`/machine/${machine.id}/details`}>Details</Link>
            <Link to={`/machine/${machine.id}/edit`}>Edit</Link>
          </td>
        </tr>
      ))}
      </table>
    </>
  );
};
```

On this page, the micro frontend lists the machines and their available actions (in this case in form of links). However, if some links (such as the one to edit a machine, see `/machine/${machine.id}/edit`) come from pages registered in another micro frontend we have a problem: How can we be sure that this is the right link and that this link remains correct?

To solve this you could

- introduce a shared state,
- introduce a lot of linting/checking/conventions,
- tackle the problem with human discipline (i.e., never change things), or
- instead of an URL, emit an event which could be picked up.

All of these options may work, but none of them is convenient. A better approach is to instead write the component as follows:

```jsx
const MachineOverviewPage = ({ data, piral }) => {
  return (
    <>
      <h1>Machines</h1>
      <table>
      {data.machines.map(machine => (
        <tr key={machine.id}>
          <td>{machine.name}</td>
          <td>
            <Link to={`/machine/${machine.id}/details`}>Details</Link>
            <piral.Extension name="machine-actions" params={machine} />
          </td>
        </tr>
      ))}
      </table>
    </>
  );
};
```

where micro frontend B registers an extension like:

```jsx
api.registerExtension('machine-actions', ({ params }) => {
  const { id } = params;

  // check if the given data has an id field as we assume / require
  if (typeof id !== 'string') {
    return null;
  }

  return <Link to={`/machine/${id}/edit`}>Edit</Link>;
});
```

Now the micro frontend owning the route also owns the visible link to the route. This is wonderful, as no other micro frontend needs to care about what the route looks like if it exists, or how to handle routing to it. The basic link could, for example, easily be replaced by micro frontend B with a button that shows a dialog before routing. No changes in micro frontend A would be necessary.

## Catalogue Overview

Sometimes there may be a set of extension components, but you are not interested in displaying this set, but rather information about the contained components.

Let's assume we have a template editor, which - depending on the template - may bring up a specialized editor. Each editor is registered via an extension, such that this system can just evolve with new template types.

The overview to create a new template may therefore look as follows:

```jsx
const TemplateOverview = ({ piral }) => {
  const render = React.useCallback((nodes) => toOverviewCards(piral, nodes), []);

  return (
    <>
      <h1>Available Templates</h1>
      <piral.Extension name="template-editor" render={render} />
    </>
  );
};
```

where the `render` function is used to "transform" each registered template editor into an overview card using the `toOverviewCards` helper function:

```jsx
function getItem(node) {
  if (typeof node === 'object' && 'props' in node) {
    const p = node.props.params;

    if (p) {
      return {
        node,
        templateId: p.id || '',
        description: p.description || '',
        title: p.title || '',
      };
    }
  }

  return {
    node,
    templateId: '',
    description: '',
    title: '',
  };
}

function toOverviewCards(api, nodes) {
  return (
    <div className="tiles">
      {nodes.map(getItem).map(item => (
        <div className="tile" key={item.templateId}>
          <h3 className="tile-title">{item.title}</h3>
          <p className="tile-description">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
```

In this case, these template editors could be registered like:

```jsx
api.registerExtension('template-editor', MyTemplateEditor, {
  id: 'my-template-editor',
  title: 'Sample Editor',
  description: 'This is just an example for the catalogue overview pattern',
});
```

The catalogue overview pattern goes well with the dynamic selection pattern.

## Dynamic Selection

Let's assume we continue the example from beforehand, however, this time the tiles are not static, but equipped with a link like this:

```jsx
<div className="tile" key={item.templateId}>
  <Link to={`/template/${item.templateId}`}>
    <h3 className="tile-title">{item.title}</h3>
    <p className="tile-description">{item.description}</p>
  <Link>
</div>
```

A page to handle this route could be registered like this:

```jsx
api.registerPage('/template/:id', ({ match, piral }) => {
  const { id } = match.params;
  const render = React.useCallback((nodes) => nodes.map(getItem).find(m => m.templateId === id)?.node || null);

  return (
    <piral.Extension name="template-editor" render={render} />
  );
})
```

Here, we use the previous definition of `getItem`, which inspects the React Node and returns an object with its information such as the `templateId`. We only render the single extension component whose metadata fits the expectation. The expectation is in this example given by the route's parameter, but it could be coming from anywhere.

The dynamic selection pattern and the catalogue pattern can also be expanded with the action placeholder pattern. In this case, you'd have two extensions instead of one. The first extension would carry the information for the catalogue, while the second extension would have a unique extension slot name, which would be shared via the first extension component's metadata.

## Data Accessor

So far we've seen that an extension slot can (and should) provide data that is useful to be shown in the current position. For instance, on a machine details page the data available for the machine would be passed into the extension slot - just to give all registered extension components *as much information* as we can.

But what happens the other way around? Let's say we have another micro frontend that is located somewhere else (e.g., billing information) and wants to show data from the machine overview. Implementing the call to the machine overview API would violate the determined domain boundaries. Potentially, the data has also already been retrieved from the micro frontend that deals with machines.

To deal with that we can register an extension component in the machine micro frontend:

```jsx
api.registerExtension('use-machine-overview', ({ params }) => {
  const [data, loading, error] = useMachineData();

  if (!params.component) {
    return null;
  }

  // to stay on topic we omit the loading and error case
  return <params.component data={data} />;
})
```

Now, every time we require the machine data we can just use an extension slot:

```jsx
const MyMachineOverview = ({ data }) => {
  // to something with data
};

const MyPage = ({ piral }) => (
  <piral.Extension name="use-machine-overview" params={{ component: MyMachineOverview }} />
);
```

This way the data and everything to obtain and update the data is still handled in the corresponding domain, while the actual code to display something resides where it should be.

## Conclusion

The extension mechanism provides a flexible way to respect the boundaries of your application domains. By using the right pattern you'll be able to reduce friction between the teams and scale the development efficiently.

In the next tutorial, you'll see some strategies on how to solve the issue of sharing multiple versions from the same dependency.
