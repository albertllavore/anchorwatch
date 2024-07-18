import '@testing-library/jest-dom/extend-expect';

// Mock TextDecoder and TextEncoder for Node.js environment
global.TextDecoder = require('util').TextDecoder;
global.TextEncoder = require('util').TextEncoder;

// Mock Firebase initialization
jest.mock('firebase/app', () => {
  const actualFirebase = jest.requireActual('firebase/app');
  return {
    ...actualFirebase,
    initializeApp: jest.fn(),
    getApp: jest.fn(() => ({
      name: '[DEFAULT]',
    })),
  };
});

jest.mock('firebase/auth', () => {
  const actualAuth = jest.requireActual('firebase/auth');
  return {
    ...actualAuth,
    getAuth: jest.fn(() => ({
      signInWithPopup: jest.fn(),
      sendSignInLinkToEmail: jest.fn(),
    })),
  };
});

jest.mock('firebase/firestore', () => {
  return {
    getFirestore: jest.fn(() => ({
      collection: jest.fn(),
      doc: jest.fn(),
      setDoc: jest.fn(),
      deleteDoc: jest.fn(),
    })),
    collection: jest.fn(),
    doc: jest.fn(),
    setDoc: jest.fn(),
    deleteDoc: jest.fn(),
  };
});
