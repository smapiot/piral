import * as React from 'react';
import { MemoryRouter } from 'react-router';

export const DefaultRouter: React.FC = ({ children }) => <MemoryRouter>{children}</MemoryRouter>;
DefaultRouter.displayName = 'DefaultRouter';
