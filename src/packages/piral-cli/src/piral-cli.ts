#!/usr/bin/env node

import { piralCommands } from './commands';
import { setupCli } from './cli';

setupCli(piralCommands);
