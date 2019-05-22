import { PiralStorage } from '../types';

const crx = /\s*(.*?)=(.*?)($|;|,(?! ))/g;

export const storage: PiralStorage = {
  setItem(name: string, data: string) {
    return localStorage.setItem(name, data);
  },
  getItem(name: string) {
    return localStorage.getItem(name);
  },
  removeItem(name: string) {
    return localStorage.removeItem(name);
  },
};

export const cookie: PiralStorage = {
  setItem(name: string, data: string, expires = '') {
    const domain = location.hostname;
    const domainPart = domain ? `domain=.${domain};` : '';
    document.cookie = `${name}=${encodeURIComponent(data)};expires="${expires}";path=/;${domainPart}`;
  },
  getItem(name: string) {
    return document.cookie.replace(crx, (_m: any, p1: string, p2: string) => (name === p1 ? p2 : ''));
  },
  removeItem(name: string) {
    this.setItem(name, '', '-1');
  },
};
