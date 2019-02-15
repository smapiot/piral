#!/usr/bin/env node

import { piletCommands } from './commands';
import { setupCli } from './cli';

setupCli(piletCommands);
