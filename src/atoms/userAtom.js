import { atom } from 'recoil';

export const userDBAtom = atom( {
  key: 'userDBAtom',
  default: null
} );

export const breadcrumbAtom = atom( {
  key: 'breadcrumbAtom',
  default: 'Home'
} );