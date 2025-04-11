import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Mock TextEncoder and TextDecoder for Node environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock Next.js Request and Response
class MockHeaders {
  constructor(init) {
    this._headers = new Map(Object.entries(init || {}));
  }

  get(key) {
    return this._headers.get(key);
  }

  has(key) {
    return this._headers.has(key);
  }

  set(key, value) {
    this._headers.set(key, value);
  }

  delete(key) {
    this._headers.delete(key);
  }

  entries() {
    return this._headers.entries();
  }

  forEach(callback) {
    this._headers.forEach(callback);
  }
}

class MockRequest {
  constructor(input, init = {}) {
    this.url = input;
    this.method = init.method || "GET";
    this.headers = new MockHeaders(init.headers);
    this.body = init.body;
  }

  async json() {
    return JSON.parse(this.body);
  }

  async text() {
    return this.body;
  }
}

global.Request = MockRequest;
global.Headers = MockHeaders;

global.Response = class Response {
  constructor(body, init = {}) {
    this.body = body;
    this.status = init.status || 200;
    this.statusText = init.statusText || "OK";
    this.ok = this.status >= 200 && this.status < 300;
    this.headers = new MockHeaders(init.headers);
  }

  async json() {
    return JSON.parse(this.body);
  }

  async text() {
    return this.body;
  }
};

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next-auth
jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

// Mock @tanstack/react-query
jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useQuery: jest.fn(),
  useMutation: jest.fn(),
}));

// Mock Prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    inventory: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = "http://localhost:3000/api";
