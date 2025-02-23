import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";
import fetchMock from "jest-fetch-mock";
fetchMock.enableMocks();

if (typeof globalThis.TextEncoder === "undefined") {
  globalThis.TextEncoder = TextEncoder;
}

if (typeof globalThis.TextDecoder === "undefined") {
  Object.defineProperty(globalThis, "TextDecoder", {
    value: TextDecoder,
    configurable: true,
    writable: true,
  });
}
