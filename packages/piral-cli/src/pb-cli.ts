#!/usr/bin/env node

import { allCommands } from './commands';
import { setupCli } from './cli';

setupCli(allCommands);
