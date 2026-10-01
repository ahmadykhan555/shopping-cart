import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'

import 'vitest'

declare module 'vitest' {
  // Vitest 5 uses Assertion<ReturnType, Actual>; jest-dom's built-in
  // vitest types still target the older single-parameter Assertion.
  interface Assertion<R = void, T = any>
    extends TestingLibraryMatchers<any, R> {}

  interface AsymmetricMatchersContaining
    extends TestingLibraryMatchers<any, any> {}
}
