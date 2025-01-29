import * as jju from 'jju';
import * as tar from 'tar';
import yargs from 'yargs';
import { detailed } from 'yargs-parser';
import glob from 'glob';
import FormData from 'form-data';
import rc = require('rc');
import mime from 'mime';
import axios from 'axios';
import inquirer from 'inquirer';
import isInteractive from 'is-interactive';
import getPort from 'get-port';
import ora from 'ora';
import chalk from 'chalk';
import { rimraf } from 'rimraf';
import { getModulePath } from './resolve';

export async function open(address: string) {
  const name = 'open';
  const openBrowser = await import(name).then((c) => c.default);
  await openBrowser(address, undefined);
}

export {
  chalk,
  inquirer,
  isInteractive,
  ora,
  glob,
  tar,
  rimraf,
  FormData,
  rc,
  axios,
  mime,
  getPort,
  jju,
  getModulePath,
  yargs,
  detailed,
};
