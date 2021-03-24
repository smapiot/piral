import * as React from 'react';

export interface PluginMetaProps {
  name: string;
  description: string;
  keywords: Array<string>;
  dependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  author: string;
  homepage: string;
  license: string;
}

export const PluginMeta: React.FC<PluginMetaProps> = ({
  description,
  keywords,
  author,
  homepage,
  license,
  dependencies = {},
  devDependencies = {},
}) => {
  const dependencyNames = Object.keys(dependencies);
  const devDependencyNames = Object.keys(devDependencies);
  const hasDependencies = dependencyNames.length + devDependencyNames.length > 0;

  return (
    <div>
      <p>{description}</p>
      <h4>Author</h4>
      <p>{author}</p>
      <h4>Homepage</h4>
      <p>
        <a href={homepage} target="_blank" rel="noopener">
          {homepage}
        </a>
      </p>
      <h4>License</h4>
      <p>
        <a href={`https://opensource.org/licenses/${license}`} target="_blank" rel="noopener">
          {license}
        </a>
      </p>
      <h4>Keywords</h4>
      <ul className="keywords">
        {keywords.map((keyword) => (
          <li key={keyword}>{keyword}</li>
        ))}
      </ul>
      <h4>Dependencies</h4>
      {hasDependencies ? (
        <>
          {dependencyNames.length > 0 && (
            <>
              <p>The package comes with the following dependencies:</p>
              <ul className="keywords">
                {dependencyNames.map((name) => (
                  <li key={name}>
                    <b>{name}</b>: {dependencies[name]}
                  </li>
                ))}
              </ul>
            </>
          )}
          {devDependencyNames.length > 0 && (
            <>
              <p>The package was developed using the following dependencies:</p>
              <ul className="keywords">
                {devDependencyNames.map((name) => (
                  <li key={name}>
                    <b>{name}</b>: {devDependencies[name]}
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      ) : (
        <p>No dependencies.</p>
      )}
    </div>
  );
};
