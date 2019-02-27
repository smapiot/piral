import * as React from 'react';
import { CodeBox, Callout, Table, Button, Video, Section, ResponsiveContent } from '../components';

export const Content: React.SFC = () => (
  <ResponsiveContent>
    <Section id="download-section" title="Download">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nec imperdiet turpis. Curabitur aliquet pulvinar
        ultrices. Etiam at posuere leo. Proin ultrices ex et dapibus feugiat <a href="#">link example</a> aenean purus
        leo, faucibus at elit vel, aliquet scelerisque dui. Etiam quis elit euismod, imperdiet augue sit amet, imperdiet
        odio. Aenean sem erat, hendrerit eu gravida id, dignissim ut ante. Nam consequat porttitor libero euismod
        congue.
      </p>
      <Button href="https://themes.3rdwavemedia.com" kind="green" target="_blank" icon="download">
        Download PrettyDocs
      </Button>
    </Section>
    <Section id="installation-section" title="Installation">
      <div id="step1" className="section-block">
        <h3 className="block-title">Step One</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum
          sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis.
        </p>
        <div className="code-block">
          <h6>Default code example:</h6>
          <p>
            <CodeBox code="bower install <package>" />
          </p>
          <p>
            <CodeBox code="npm install <package>" />
          </p>
        </div>
      </div>
      <div id="step2" className="section-block">
        <h3 className="block-title">Step Two</h3>
        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.</p>
        <div className="row">
          <div className="col-md-6 col-12">
            <h6>Un-ordered list example</h6>
            <ul className="list">
              <li>Lorem ipsum dolor sit amet.</li>
              <li>Aliquam tincidunt mauris.</li>
              <li>
                Ultricies eget vel aliquam libero.
                <ul>
                  <li>Turpis pulvinar</li>
                  <li>Feugiat scelerisque</li>
                  <li>Ut tincidunt</li>
                </ul>
              </li>
              <li>Pellentesque habitant morbi.</li>
              <li>Praesent dapibus, neque id.</li>
            </ul>
          </div>
          <div className="col-md-6 col-12">
            <h6>Ordered list example</h6>
            <ol className="list">
              <li>Lorem ipsum dolor sit amet.</li>
              <li>Aliquam tincidunt mauris.</li>
              <li>
                Ultricies eget vel aliquam libero.
                <ul>
                  <li>Turpis pulvinar</li>
                  <li>Feugiat scelerisque</li>
                  <li>Ut tincidunt</li>
                </ul>
              </li>
              <li>Pellentesque habitant morbi.</li>
              <li>Praesent dapibus, neque id.</li>
            </ol>
          </div>
        </div>
      </div>
      <div id="step3" className="section-block">
        <h3 className="block-title">Step Three</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum
          sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis.
        </p>
      </div>
    </Section>
    <Section id="code-section" title="Code">
      <p>
        <a href="https://prismjs.com/" target="_blank">
          PrismJS
        </a>{' '}
        is used as the syntax highlighter here. You can{' '}
        <a href="https://prismjs.com/download.html" target="_blank">
          build your own version
        </a>{' '}
        via their website should you need to.
      </p>
      <div id="html" className="section-block">
        <Callout title="Useful Tip:" type="success" icon="thumbs-up">
          <p>
            You can use this online{' '}
            <a href="https://mothereff.in/html-entities" target="_blank">
              HTML entity encoder/decoder
            </a>{' '}
            to generate your code examples.
          </p>
        </Callout>
        <div className="code-block">
          <h6>HTML Code Example</h6>
          <pre>
            <CodeBox
              language="markup"
              code={`<!DOCTYPE html>
  <html lang="en"> ... <div class="jumbotron">
  <h1>Hello, world!</h1> <p>...</p>
  <p><a class="btn btn-primary btn-lg" href="#"
  role="button">Learn more</a></p> </div> <div
  class="jumbotron"> <h1>Hello, world!</h1> <p>...</p>
  <p><a class="btn btn-primary btn-lg" href="#"
  role="button">Learn more</a></p> </div> ... </html>`}
            />
          </pre>
        </div>
      </div>
      <div id="css" className="section-block">
        <div className="code-block">
          <h6>CSS Code Example</h6>
          <pre>
            <CodeBox
              language="css"
              code={`/* ======= Base Styling ======= */
  body {
  font-family: 'Open Sans', arial, sans-serif;
  color: #333;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  }`}
            />
          </pre>
        </div>
      </div>
      <div id="sass" className="section-block">
        <div className="code-block">
          <h6>SCSS Code Example</h6>
          <pre>
            <CodeBox
              language="css"
              code={`@mixin transform($property) {
  -webkit-transform: $property;
  -ms-transform: $property;
  transform: $property;
  }

  .box { @include transform(rotate(30deg)); }`}
            />
          </pre>
        </div>
      </div>
      <div id="less" className="section-block">
        <div className="code-block">
          <h6>LESS Code Example</h6>
          <pre>
            <CodeBox
              language="css"
              code={`@base: #f04615;
  @width: 0.5;

  .class {
  width: percentage(@width); // returns &#x60;50%&#x60;
  color: saturate(@base, 5%);
  background-color: spin(lighten(@base, 25%), 8);
  }`}
            />
          </pre>
        </div>
      </div>
      <div id="javascript" className="section-block">
        <div className="code-block">
          <h6>JavaScript Code Example</h6>
          <pre>
            <CodeBox
              language="javascript"
              code={`<script>
  function myFunction(a, b) {
  return a * b;
  }

  document.getElementById('demo').innerHTML = myFunction(4, 3);
  </script>`}
            />
          </pre>
        </div>
      </div>
      <div id="python" className="section-block">
        <div className="code-block">
          <h6>Python Code Example</h6>
          <pre>
            <CodeBox
              language="python"
              code={`
  >>> x = int(input(" Please enter an integer: ")) Please enter an integer: 42
  >>> if x < 0: ... x = 0 ... print('Negative changed to zero') ... elif x == 0: ...
  print('Zero') ... elif x == 1: ... print('Single') ... else: ... print('More') ... More
              `}
            />
          </pre>
        </div>
      </div>
      <div id="php" className="section-block">
        <div className="code-block">
          <h6>PHP Code Example</h6>
          <pre>
            <CodeBox
              language="php"
              code={`
  <?php $txt = "Hello world!"; $x = 5; $y = 10.5; echo $txt; echo "<br>";
  echo $x; echo "<br>"; echo $y; ?>
                `}
            />
          </pre>
        </div>
      </div>
      <div id="handlebars" className="section-block">
        <div className="code-block">
          <h6>Handlebars Code Example</h6>
          <pre>
            <CodeBox
              language="handlebars"
              code={`Handlebars.registerHelper('list', function(items, options) {
  var out ='<ul>';

  for (var i=0, l=items.length; i < l; i++) {
  out = out + '<li>' + options.fn(items[i]) + '</li>';
  }

  return out + '</ul>';
  });`}
            />
          </pre>
        </div>
        <div className="code-block">
          <h6>Git Code Example</h6>
          <pre>
            <CodeBox language="git" code={`$ git add Documentation.txt`} />
          </pre>
        </div>
      </div>
    </Section>
    <Section id="callouts-section" title="Callouts">
      <p>
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum
        sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies
        nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel,
        aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.
      </p>
      <div className="section-block">
        <Callout title="Aenean imperdiet" icon="info-circle" type="info">
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium <code>&lt;code&gt;</code> , Nemo
            enim ipsam voluptatem quia voluptas <a href="#">link example</a> sit aspernatur aut odit aut fugit.
          </p>
        </Callout>
        <Callout title="Morbi posuere" icon="bug" type="warning">
          <p>
            Nunc hendrerit odio quis dignissim efficitur. Proin ut finibus libero. Morbi posuere fringilla felis eget
            sagittis. Fusce sem orci, cursus in tortor <a href="#">link example</a> tellus vel diam viverra elementum.
          </p>
        </Callout>
        <Callout title="Lorem ipsum dolor sit amet" icon="thumbs-up" type="success">
          <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. <a href="#">Link example</a> aenean commodo ligula
            eget dolor.
          </p>
        </Callout>
        <Callout title="Interdum et malesuada" icon="exclamation-triangle" type="danger">
          <p>
            Morbi eget interdum sapien. Donec sed turpis sed nulla lacinia accumsan vitae ut tellus. Aenean vestibulum{' '}
            <a href="#">Link example</a> maximus ipsum vel dignissim. Morbi ornare elit sit amet massa feugiat, viverra
            dictum ipsum pellentesque.
          </p>
        </Callout>
      </div>
    </Section>
    <Section id="tables-section" title="Tables">
      <p>
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum
        sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis.
      </p>
      <div className="section-block">
        <h6>Basic Table</h6>
        <Table
          indexed
          data={{
            head: ['First Name', 'Last Name', 'Username'],
            body: [['Mark', 'Otto', '@mdo'], ['Jacob', 'Thornton', '@fat'], ['Larry', 'the Bird', '@twitter']],
          }}
        />
        <h6>Striped Table</h6>
        <Table
          striped
          indexed
          data={{
            head: ['First Name', 'Last Name', 'Username'],
            body: [['Mark', 'Otto', '@mdo'], ['Jacob', 'Thornton', '@fat'], ['Larry', 'the Bird', '@twitter']],
          }}
        />
        <h6>Bordered Table</h6>
        <Table
          bordered
          indexed
          data={{
            head: ['First Name', 'Last Name', 'Username'],
            body: [['Mark', 'Otto', '@mdo'], ['Jacob', 'Thornton', '@fat'], ['Larry', 'the Bird', '@twitter']],
          }}
        />
      </div>
    </Section>
    <Section id="buttons-section" title="Buttons">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nec imperdiet turpis. Curabitur aliquet pulvinar
        ultrices. Etiam at posuere leo. Proin ultrices ex et dapibus feugiat <a href="#">link example</a> aenean purus
        leo, faucibus at elit vel, aliquet scelerisque dui. Etiam quis elit euismod, imperdiet augue sit amet, imperdiet
        odio. Aenean sem erat, hendrerit eu gravida id, dignissim ut ante. Nam consequat porttitor libero euismod
        congue.
      </p>
      <div className="row">
        <div className="col-md-6 col-12">
          <h6>Basic Buttons</h6>
          <ul className="list list-unstyled">
            <li>
              <Button kind="primary">Primary Button</Button>
            </li>
            <li>
              <Button kind="green">Green Button</Button>
            </li>
            <li>
              <Button kind="blue">Blue Button</Button>
            </li>
            <li>
              <Button kind="orange">Orange Button</Button>
            </li>
            <li>
              <Button kind="red">Red Button</Button>
            </li>
          </ul>
        </div>
        <div className="col-md-6 col-12">
          <h6>Icon Buttons</h6>
          <ul className="list list-unstyled">
            <li>
              <Button kind="primary" icon="download">
                Download Now
              </Button>
            </li>
            <li>
              <Button kind="green" icon="code-branch">
                Fork Now
              </Button>
            </li>
            <li>
              <Button kind="blue" icon="play-circle">
                Find Out Now
              </Button>
            </li>
            <li>
              <Button kind="orange" icon="bug">
                Report Bugs
              </Button>
            </li>
            <li>
              <Button kind="red" icon="exclamation-circle">
                Submit Issues
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </Section>
    <Section id="video-section" title="Video">
      <div className="row">
        <div className="col-md-6 col-12">
          <h6>Responsive Video 16:9</h6>
          <Video format="16by9" url="https://www.youtube.com/embed/ejBkOjEG6F0?rel=0&amp;controls=0&amp;showinfo=0" />
        </div>
        <div className="col-md-6 col-12">
          <h6>Responsive Video 4:3</h6>
          <Video format="4by3" url="https://www.youtube.com/embed/ejBkOjEG6F0?rel=0&amp;controls=0&amp;showinfo=0" />
        </div>
      </div>
      <Section id="icons-section" title="Icons">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nec imperdiet turpis. Curabitur aliquet
          pulvinar ultrices. Etiam at posuere leo. Proin ultrices ex et dapibus feugiat <a href="#">link example</a>{' '}
          aenean purus leo, faucibus at elit vel, aliquet scelerisque dui. Etiam quis elit euismod, imperdiet augue sit
          amet, imperdiet odio. Aenean sem erat, hendrerit eu gravida id, dignissim ut ante. Nam consequat porttitor
          libero euismod congue.
        </p>
      </Section>
    </Section>
  </ResponsiveContent>
);
