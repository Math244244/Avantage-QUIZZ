// Setup global pour tests Vitest
import { vi } from 'vitest';

// Mock Firebase
global.firebase = {
    auth: vi.fn(),
    firestore: vi.fn()
};

// Mock console pour réduire le bruit dans les tests
global.console = {
    ...console,
    log: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    // Garder error pour debugging
    error: console.error
};

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
            store[key] = value.toString();
        },
        removeItem: (key) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        }
    };
})();

global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = (() => {
    let store = {};
    
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
            store[key] = value.toString();
        },
        removeItem: (key) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        }
    };
})();

global.sessionStorage = sessionStorageMock;

// Mock window.location
delete global.window.location;
global.window.location = {
    href: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
    reload: vi.fn(),
    replace: vi.fn()
};

// Mock fetch
global.fetch = vi.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(''),
        status: 200,
        statusText: 'OK'
    })
);

// Cleanup après chaque test
afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
});
