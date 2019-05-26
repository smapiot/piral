import * as React from 'react';
import { LoaderProps } from '../../types';

export const DefaultLoader: React.SFC<LoaderProps> = () => <div>Loading</div>;
DefaultLoader.displayName = 'DefaultLoader';

export default DefaultLoader;
