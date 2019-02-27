import * as React from 'react';
import { ResponsiveContent, Section, CodeBox, Question } from '../components';

export const Content: React.SFC = () => (
  <ResponsiveContent>
    <Section id="general" title="General">
      <Question title="Can I viverra sit amet quam eget lacinia?">
        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque
        corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in
        culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et
        expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id
        quod maxime placeat facere.
      </Question>
      <Question title="What is the ipsum dolor sit amet quam tortor?" highlight="new">
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
        aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
      </Question>
      <Question title="How does the morbi quam tortor work?">
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum
        sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis. Vestibulum
        vitae justo quam. Nulla luctus nunc in neque suscipit dictum. Cras faucibus magna sem, non accumsan quam
        interdum elementum. Pellentesque sollicitudin orci mauris, sit amet mollis nisi vehicula ut. Fusce non accumsan
        massa, tempus dictum leo. Suspendisse ornare ex vel imperdiet cursus.
      </Question>
      <Question title="How does the morbi quam tortor work?" highlight="updated">
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum
        sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis.
      </Question>
      <Question title="How do I submit gravida justo ut sem feugiat?">
        Quisque rhoncus elit in ullamcorper finibus. Mauris diam ipsum, tristique id nibh at, sagittis suscipit odio.
        Donec lacinia consequat augue vulputate pellentesque. Donec sed vehicula purus. Aliquam ac enim non magna
        vulputate mattis. Proin non vulputate est, id aliquam tortor.{' '}
      </Question>
      <Question title="Are there any gravida justo ut sem feugiat?">
        Curabitur convallis sapien eget porttitor tincidunt. Aenean vehicula congue tortor, in ullamcorper metus porta
        a. Sed congue condimentum turpis vel hendrerit. Nam dapibus nunc eu tellus accumsan, viverra posuere nibh
        dapibus. Nam nec condimentum elit. Aliquam erat volutpat. Proin dictum est a lacus semper porta. Pellentesque
        nec efficitur lectus, at tincidunt felis. Etiam ultrices malesuada nulla, sit amet luctus leo semper sit amet.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </Question>
    </Section>

    <Section id="features" title="Features">
      <Question title="Why am I getting congue condimentum turpis?">
        <p>
          Curabitur convallis sapien eget porttitor tincidunt. Aenean vehicula congue tortor, in ullamcorper metus porta
          a. Sed congue condimentum turpis vel hendrerit. Nam dapibus nunc eu tellus accumsan, viverra posuere nibh
          dapibus. Nam nec condimentum elit. Aliquam erat volutpat. Proin dictum est a lacus semper porta. Pellentesque
          nec efficitur lectus, at tincidunt felis. Etiam ultrices malesuada nulla, sit amet luctus leo semper sit amet.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <pre>
          <CodeBox
            language="python"
            code={`class label: pass
  # declare a label
  try: ...
    if condition:
      raise label()
  # goto label ...
  except label:
  # where to goto pass ...`}
          />
        </pre>
        <p>
          Duis ligula ante, lobortis pretium maximus ut, mattis quis augue. Curabitur vel posuere lorem, sit amet
          consectetur orci. Sed mollis eget nisi eu aliquam.
        </p>
      </Question>

      <Question title="How are gravida implemented?">
        <p>
          Curabitur convallis sapien eget porttitor tincidunt. Aenean vehicula congue tortor, in ullamcorper metus porta
          a. Sed congue condimentum turpis vel hendrerit. Nam dapibus nunc eu tellus accumsan, viverra posuere nibh
          dapibus. Nam nec condimentum elit. Aliquam erat volutpat. Proin dictum est a lacus semper porta. Pellentesque
          nec efficitur lectus, at tincidunt felis. Etiam ultrices malesuada nulla, sit amet luctus leo semper sit amet.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </Question>

      <Question title="How does vehicula manage congue tortor?">
        Curabitur convallis sapien eget porttitor tincidunt. Aenean vehicula congue tortor, in ullamcorper metus porta
        a. Sed congue condimentum turpis vel hendrerit. Nam dapibus nunc eu tellus accumsan, viverra posuere nibh
        dapibus. Nam nec condimentum elit. Aliquam erat volutpat. Proin dictum{' '}
        <code>&#x3C;div&#x3E;...&#x3C;/div&#x3E;</code> est a lacus semper porta. Pellentesque nec efficitur lectus, at
        tincidunt felis. Etiam ultrices malesuada nulla, sit amet luctus leo semper sit amet. Lorem ipsum dolor sit
        amet, consectetur adipiscing elit.
      </Question>

      <Question title="Why does vehicula manage congue tortor?">
        Aliquam a dui turpis. In vel tellus eget erat ullamcorper egestas at et lectus. Fusce a consectetur nisi,
        malesuada volutpat tellus. Nam ut urna nec urna dictum dictum sagittis id lacus. Aliquam auctor dapibus est, sit
        amet vehicula purus sollicitudin a. Morbi pulvinar euismod quam et aliquam. In hac habitasse platea dictumst.
        Quisque vel euismod sem, sit amet viverra justo.
      </Question>

      <Question title="Why does vehicula manage congue tortor?">
        Quisque dignissim, lectus ac pretium dapibus, nunc arcu ornare nunc, et aliquam odio augue vitae eros. Cras vel
        risus quam. Aenean ultricies molestie purus bibendum lobortis. Curabitur vehicula, nisi ut tincidunt consequat,
        augue mi volutpat nisl, id posuere felis lectus quis quam. Donec at eros consequat, cursus eros eget, ornare
        mauris. Proin semper tincidunt dapibus. Etiam ornare, nibh eu dapibus pellentesque, magna metus dapibus neque,
        euismod fringilla nulla orci eu dolor. Mauris convallis rutrum efficitur. Integer sagittis nisi in ante
        convallis tempor. In placerat, velit quis laoreet sollicitudin, massa est sagittis massa, quis viverra diam nibh
        vitae sapien. Nunc facilisis nisl non condimentum pretium. Duis nec metus venenatis, hendrerit nisi maximus,
        consequat erat. Morbi odio mauris, aliquam eu bibendum vel, pulvinar at sem. Nunc sit amet elementum nisl, ac
        malesuada nibh. Vestibulum imperdiet dui non venenatis bibendum.
      </Question>
    </Section>

    <Section id="pricing" title="Pricing">
      <Question title="How much is magna at posuere?" highlight="new">
        Curabitur nec ipsum placerat, accumsan justo eu, imperdiet augue. Praesent eget mattis erat. Donec dolor odio,
        maximus quis est ut, bibendum pharetra ante. Sed faucibus nec dui sed elementum. Nullam aliquet, dui at bibendum
        egestas, lorem metus euismod libero, ut porta risus felis eget odio. Aenean tincidunt magna at posuere semper.
        Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
      </Question>

      <Question title="Can I risus felis eget odio?">
        Curabitur nec ipsum placerat, accumsan justo eu, imperdiet augue. Praesent eget mattis erat. Donec dolor odio,
        maximus quis est ut, bibendum pharetra ante. Sed faucibus nec dui sed elementum. Nullam aliquet, dui at bibendum
        egestas, lorem metus euismod libero, ut porta risus felis eget odio. Aenean tincidunt magna at posuere semper.
        Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
      </Question>

      <Question title="Can I purus lobortis nibh?">
        Ut cursus, felis vel vulputate dictum, nisi mauris aliquam mi, sed venenatis leo sem eu diam. Etiam pulvinar
        aliquet eros, vitae consequat ex consectetur eu. Nulla non purus a orci volutpat scelerisque. Aliquam consequat
        lacus eu ante ornare mattis. Praesent vitae est ut nibh maximus auctor. Donec eget sem eget lectus eleifend
        ullamcorper sit amet vel quam.
      </Question>

      <Question title="Why consequat lacus eu ante?">
        Nulla a convallis augue, eget scelerisque sapien. Nulla ut purus lobortis nibh viverra auctor eget vitae sem.
        Quisque mi odio, eleifend ac mollis vel, laoreet a risus. Morbi ullamcorper luctus est, in mollis lorem
        ullamcorper vel. Phasellus et dolor purus. Mauris auctor ullamcorper mauris sollicitudin aliquet. Pellentesque
        habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
      </Question>
    </Section>

    <Section id="support" title="Support">
      <Question title="Quisque consectetur iaculis odio">
        Nulla a convallis augue, eget scelerisque sapien. Nulla ut purus lobortis nibh viverra auctor eget vitae sem.
        Quisque mi odio, eleifend ac mollis vel, laoreet a risus. Morbi ullamcorper luctus est, in mollis lorem
        ullamcorper vel. Phasellus et dolor purus. Mauris auctor ullamcorper mauris sollicitudin aliquet. Pellentesque
        habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
      </Question>

      <Question title="Duis maximus mollis sit amet pharetra?">
        Nulla a convallis augue, eget scelerisque sapien. Nulla ut purus lobortis nibh viverra auctor eget vitae sem.
        Quisque mi odio, eleifend ac mollis vel, laoreet a risus. Morbi ullamcorper luctus est, in mollis lorem
        ullamcorper vel. Phasellus et dolor purus. Mauris auctor ullamcorper mauris sollicitudin aliquet. Pellentesque
        habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
      </Question>

      <Question title="Pellentesque habitant morbi tristique senectus?">
        <p>
          Nulla a convallis augue, eget scelerisque sapien. Nulla ut purus lobortis nibh viverra auctor eget vitae sem.
          Quisque mi odio, eleifend ac mollis vel, laoreet a risus. Morbi ullamcorper luctus est, in mollis lorem
          ullamcorper vel. Phasellus et dolor purus. Mauris auctor ullamcorper mauris sollicitudin aliquet. Pellentesque
          habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
        </p>
        <p>
          Integer ornare tristique massa, et efficitur diam. Quisque consectetur iaculis odio, in aliquet magna suscipit
          eget. Sed sollicitudin facilisis risus vitae mattis. Vivamus facilisis, lacus eu rutrum gravida, ante sapien
          semper lectus, eget venenatis lorem massa porta sapien. Curabitur facilisis egestas erat, vel facilisis ipsum
          laoreet sit amet. Sed fermentum metus eget semper semper. Pellentesque imperdiet accumsan dolor eu convallis.
          Donec dictum justo a leo pellentesque placerat. Maecenas non diam ac elit tincidunt convallis ut nec eros.
        </p>
      </Question>
    </Section>
  </ResponsiveContent>
);
