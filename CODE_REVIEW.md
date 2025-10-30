# Principal Engineer Code Review - QuickMart Checkout Electron App

**Reviewer**: Principal Engineer
**Date**: 2025-10-30
**Codebase**: QuickMart Self-Checkout Electron Application
**Review Type**: Comprehensive Architecture & Security Review

---

## Executive Summary

This codebase represents a **modern, well-structured Electron application** for a supermarket self-checkout system. The migration from a web-only app to Electron was executed with **strong security practices**, and the recent addition of Biome for linting/formatting demonstrates commitment to code quality.

**Overall Grade: B+** (Very Good)

### Key Strengths
✅ Excellent security implementation in Electron layer
✅ Modern React patterns with TypeScript
✅ Clean component architecture
✅ Fast tooling (Vite + Biome)
✅ Proper separation of concerns

### Critical Gaps
❌ No test coverage whatsoever
❌ Weak TypeScript configuration
❌ Missing error handling and logging
❌ No state persistence
❌ Bundle size bloat (unused dependencies)

---

## 1. Architecture Review

### 1.1 Project Structure ⭐⭐⭐⭐ (4/5)

**Strengths:**
- Clean separation between Electron process (`electron/`) and React app (`src/`)
- Logical component organization with clear responsibilities
- Type definitions properly isolated (`src/types/`)
- UI components well-organized under `src/components/ui/`

**Issues:**
```
src/pages/Index.tsx:51
├─ CONCERN: Business logic mixed with presentation
├─ Total calculation should be in a hook or utility
└─ Recommendation: Extract to useCart() custom hook
```

**Recommendation:**
```typescript
// Create src/hooks/useCart.ts
export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const addToCart = useCallback((product: Product) => { /* ... */ }, []);

  return { cart, total, addToCart, /* ... */ };
};
```

### 1.2 Electron Architecture ⭐⭐⭐⭐⭐ (5/5)

**Exceptional implementation:**

```typescript
electron/main.ts:22-27
✓ Context isolation enabled
✓ Node integration disabled
✓ Sandbox mode enabled
✓ Proper preload script setup
```

**Security measures (electron/main.ts:69-88):**
- Navigation prevention to external URLs
- Window open handler blocks popups
- Proper IPC channel validation

**Minor improvement:**
```typescript
// Add CSP headers for defense-in-depth
app.on('web-contents-created', (_, contents) => {
  contents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
        ]
      }
    });
  });
});
```

---

## 2. Security Analysis

### 2.1 Security Score: ⭐⭐⭐⭐ (4/5)

**Strengths:**
1. **Electron Security Best Practices** - All critical flags properly set
2. **IPC Security** - Context bridge properly isolates main/renderer
3. **No Direct DOM Manipulation** - React handles all rendering
4. **Type Safety** - TypeScript prevents many injection vectors

**Vulnerabilities Found:**

#### 🔴 MEDIUM: Lack of Input Validation
```typescript
src/pages/Index.tsx:14-26
├─ Risk: No validation on product addition
├─ Attack: Malformed product could break cart state
└─ Fix: Add Zod schema validation

// Recommended fix:
import { z } from 'zod';

const ProductSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.number().positive(),
  category: z.string(),
  image: z.string(),
  barcode: z.string().regex(/^\d{13}$/)
});

const addToCart = (product: Product) => {
  const validated = ProductSchema.parse(product); // Throws on invalid
  // ... rest of logic
};
```

#### 🟡 LOW: XSS via Product Data
```typescript
src/data/products.ts
├─ Risk: Static data is safe, but structure allows arbitrary strings
├─ Impact: If products loaded from API, names could contain HTML
└─ Fix: Sanitize product names or use Text nodes only
```

#### 🟢 INFO: dangerouslySetInnerHTML Usage
```typescript
src/components/ui/chart.tsx:73
├─ Status: Acceptable for theming CSS
├─ Note: Static THEMES object, not user input
└─ Action: Document why this is safe
```

### 2.2 Dependency Security

**Analysis:**
```bash
Node modules: 865MB (BLOATED)
Dependencies: 48 packages
Dev Dependencies: ~20 packages
```

**Unused Dependencies Detected:**
```json
{
  "cmdk": "Not used - no command palette",
  "recharts": "Not used - no charts in app",
  "embla-carousel-react": "Not used - no carousels",
  "react-day-picker": "Not used - no date pickers",
  "react-hook-form": "Not used - no forms",
  "date-fns": "Not used - no date formatting",
  "vaul": "Not used - no drawer component",
  "react-resizable-panels": "Not used - no resizable layouts"
}
```

**Recommendation:**
```bash
# Remove unused packages (saves ~200MB)
npm uninstall cmdk recharts embla-carousel-react react-day-picker \
  react-hook-form date-fns vaul react-resizable-panels \
  @hookform/resolvers zod input-otp next-themes

# This will reduce bundle size by ~40%
```

---

## 3. Code Quality & Patterns

### 3.1 TypeScript Configuration ⭐⭐ (2/5) - **CRITICAL ISSUE**

```typescript
tsconfig.json:9-14
├─ ❌ noImplicitAny: false (DANGEROUS)
├─ ❌ strictNullChecks: false (DANGEROUS)
├─ ❌ noUnusedLocals: false
├─ ❌ noUnusedParameters: false
└─ Impact: Type safety compromised, bugs will slip through
```

**This is unacceptable for production code.**

**Required Fix:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

**Expected Errors:** ~15-20 type errors will surface (which currently exist but are hidden)

### 3.2 React Patterns ⭐⭐⭐⭐ (4/5)

**Good practices:**
- Functional components throughout
- Proper use of hooks (useState, useCallback would improve further)
- Props properly typed with interfaces
- No prop drilling (simple state structure)

**Areas for improvement:**

```typescript
src/pages/Index.tsx:14-40
├─ Missing useCallback on handlers (causes unnecessary re-renders)
└─ Missing useMemo on filtered/sorted data

// Recommended:
const addToCart = useCallback((product: Product) => {
  setCart((prev) => {
    const existing = prev.find((item) => item.id === product.id);
    // ... rest
  });
}, []); // No dependencies needed

const total = useMemo(
  () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
  [cart]
);
```

### 3.3 State Management ⭐⭐⭐ (3/5)

**Current approach:** Local useState (acceptable for small app)

**Issues:**
1. Cart state not persisted (lost on reload)
2. No undo/redo capability
3. No optimistic updates

**Recommendations:**

**Option 1: Add persistence with localStorage**
```typescript
const [cart, setCart] = useState<CartItem[]>(() => {
  const saved = localStorage.getItem('cart');
  return saved ? JSON.parse(saved) : [];
});

useEffect(() => {
  localStorage.setItem('cart', JSON.stringify(cart));
}, [cart]);
```

**Option 2: Upgrade to Zustand (recommended for Electron)**
```typescript
// src/stores/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      addItem: (product) => set((state) => ({
        items: [...state.items, { ...product, quantity: 1 }]
      })),
      // ... other actions
    }),
    { name: 'cart-storage' }
  )
);
```

---

## 4. Performance Analysis

### 4.1 Bundle Size ⭐⭐ (2/5)

**Current State:**
```
node_modules: 865MB
Estimated bundle: ~2-3MB (not optimized)
Unused code: ~40% of dependencies
```

**Impact:**
- Slower app startup
- Larger installer size
- More memory usage
- Longer build times

**Optimization Plan:**

```json
// vite.config.ts - Add code splitting
{
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-scroll-area'],
          'icons': ['lucide-react']
        }
      }
    }
  }
}
```

### 4.2 Rendering Performance ⭐⭐⭐ (3/5)

**Issues:**

```typescript
src/pages/Index.tsx:74-76
├─ Products array mapped without key optimization
├─ ProductCard re-renders on every cart change
└─ Fix: Memoize ProductCard

// Recommended:
const ProductCard = memo(({ product, onAddToCart }: ProductCardProps) => {
  // ... component logic
}, (prev, next) => prev.product.id === next.product.id);
```

```typescript
src/components/CartSidebar.tsx:21-22
├─ Total recalculated on every render
├─ ItemCount recalculated on every render
└─ Already using reduce efficiently, but wrap in useMemo
```

### 4.3 Image Optimization ⭐⭐⭐ (3/5)

```typescript
src/data/products.ts
├─ Images imported as static assets (good)
├─ No lazy loading for product images
└─ No responsive images

// Add lazy loading:
<img
  src={product.image}
  alt={product.name}
  loading="lazy"
  className="..."
/>
```

---

## 5. Error Handling & Resilience

### 5.1 Error Handling Score: ⭐ (1/5) - **CRITICAL GAP**

**Current state:** Almost no error handling

```typescript
Grep Results:
├─ try/catch blocks: 4 (all in UI library code)
├─ Error boundaries: 0
├─ Loading states: 2
└─ Error states: 0
```

**Critical Missing Elements:**

#### 1. No Error Boundary
```typescript
// src/components/ErrorBoundary.tsx (MISSING)
import React from 'react';

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to Sentry/monitoring service
    console.error('React Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <button onClick={() => window.location.reload()}>
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
```

#### 2. No Payment Error Handling
```typescript
src/components/CheckoutModal.tsx:27-41
├─ Simulated payment with setTimeout
├─ No error handling if payment fails
└─ No retry mechanism

// Add error handling:
const handlePayment = async () => {
  if (!paymentMethod) return;

  setProcessing(true);
  try {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 5% failure rate for testing
        if (Math.random() < 0.05) {
          reject(new Error('Payment processing failed'));
        }
        resolve(null);
      }, 2000);
    });

    setComplete(true);
    setTimeout(() => {
      onComplete();
      resetState();
    }, 2000);
  } catch (error) {
    toast.error('Payment failed. Please try again.');
    setProcessing(false);
  }
};
```

#### 3. No Network Error Handling
```typescript
// Future-proofing: If products loaded from API
const loadProducts = async () => {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) throw new Error('Failed to load products');
    return await response.json();
  } catch (error) {
    toast.error('Failed to load products. Please check your connection.');
    return []; // Fallback to empty array
  }
};
```

### 5.2 Logging Strategy: ⭐ (1/5)

**Current:** Only 1 console.log in entire codebase (NotFound page)

**Required:**
```typescript
// src/utils/logger.ts
export const logger = {
  info: (message: string, meta?: object) => {
    if (window.electronAPI) {
      // Send to main process for file logging
      window.electronAPI.log?.('info', message, meta);
    }
    console.log(message, meta);
  },
  error: (message: string, error?: Error, meta?: object) => {
    if (window.electronAPI) {
      window.electronAPI.log?.('error', message, { error, ...meta });
    }
    console.error(message, error, meta);
  }
};

// In electron/main.ts - add file logging
import fs from 'fs';
import path from 'path';

ipcMain.handle('log', (_, level, message, meta) => {
  const logPath = path.join(app.getPath('userData'), 'logs', 'app.log');
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp} [${level}] ${message} ${JSON.stringify(meta)}\n`;

  fs.appendFile(logPath, logEntry, (err) => {
    if (err) console.error('Failed to write log:', err);
  });
});
```

---

## 6. Testing & Quality Assurance

### 6.1 Test Coverage: ⭐ (0/5) - **BLOCKING ISSUE**

**Current state:**
```bash
Tests found: 0
Test files: 0
Coverage: 0%
```

**This is a **release blocker** for any production deployment.**

**Minimum Required Tests:**

```typescript
// src/hooks/useCart.test.ts
import { renderHook, act } from '@testing-library/react';
import { useCart } from './useCart';

describe('useCart', () => {
  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.total).toBe(mockProduct.price);
  });

  it('should increment quantity for existing item', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct);
      result.current.addToCart(mockProduct);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].quantity).toBe(2);
  });

  it('should calculate total correctly', () => {
    // ... test
  });
});
```

```typescript
// src/components/CheckoutModal.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CheckoutModal } from './CheckoutModal';

describe('CheckoutModal', () => {
  it('should complete payment flow', async () => {
    const onComplete = jest.fn();
    render(
      <CheckoutModal
        isOpen={true}
        onClose={jest.fn()}
        items={mockCartItems}
        total={100}
        onComplete={onComplete}
      />
    );

    fireEvent.click(screen.getByText(/Credit\/Debit Card/i));
    fireEvent.click(screen.getByText(/Complete Payment/i));

    await waitFor(() => expect(onComplete).toHaveBeenCalled(), {
      timeout: 3000
    });
  });
});
```

**Setup Required:**
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event vitest @vitest/ui jsdom
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      threshold: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80
      }
    }
  }
});
```

### 6.2 E2E Testing

**Recommendation:** Add Playwright for Electron testing

```typescript
// e2e/checkout-flow.spec.ts
import { test, expect, _electron as electron } from '@playwright/test';

test('complete checkout flow', async () => {
  const app = await electron.launch({ args: ['.'] });
  const window = await app.firstWindow();

  await window.click('[data-testid="product-1-add"]');
  await window.click('[data-testid="checkout-button"]');
  await window.click('[data-testid="payment-card"]');
  await window.click('[data-testid="complete-payment"]');

  await expect(window.locator('text=Payment Successful')).toBeVisible();

  await app.close();
});
```

---

## 7. Build & Deployment

### 7.1 Build Configuration ⭐⭐⭐⭐ (4/5)

**Strengths:**
- Vite for fast builds
- Proper production/development modes
- electron-builder configured correctly
- Multi-platform builds supported

**Issues:**

```json
package.json:98-139
├─ No code signing configured
├─ No auto-update mechanism
└─ No build versioning automation
```

**Recommendations:**

```json
// package.json - add auto-update
{
  "build": {
    "appId": "com.quickmart.checkout",
    "productName": "QuickMart Checkout",
    "publish": {
      "provider": "github",
      "owner": "yourorg",
      "repo": "quickmart-checkout"
    },
    "mac": {
      "hardenedRuntime": true,
      "gatekeeperAssess": false,
      "entitlements": "build/entitlements.mac.plist",
      "entitlementsInherit": "build/entitlements.mac.plist"
    },
    "afterSign": "electron-builder-notarize"
  }
}
```

```typescript
// electron/main.ts - add auto-updater
import { autoUpdater } from 'electron-updater';

app.whenReady().then(() => {
  if (!process.env.VITE_DEV_SERVER_URL) {
    autoUpdater.checkForUpdatesAndNotify();
  }
});
```

### 7.2 CI/CD ⭐ (0/5)

**Missing:** No GitHub Actions or CI/CD pipeline

**Required GitHub Actions:**

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm run check
      - run: npm run test # (once tests exist)
      - run: npm run build

  build:
    needs: test
    strategy:
      matrix:
        os: [macos-latest, windows-latest, ubuntu-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: ${{ matrix.os }}-build
          path: release/**
```

---

## 8. Documentation

### 8.1 Documentation Score: ⭐⭐⭐ (3/5)

**Existing:**
- README.md (outdated - still references Lovable)
- ELECTRON.md (excellent - comprehensive)
- Inline comments (minimal but adequate)

**Missing:**
- Architecture decision records (ADRs)
- API documentation
- Development guidelines
- Deployment procedures
- Security policies

**Required Updates:**

```markdown
# README.md (needs complete rewrite)

# QuickMart Self-Checkout

Enterprise-grade self-checkout system built with Electron and React.

## Features
- 🛒 Intuitive product selection
- 💳 Multiple payment methods
- ⚡ Fast, native performance
- 🔒 Bank-grade security

## Quick Start
\`\`\`bash
npm install
npm run dev:electron
\`\`\`

## Building
\`\`\`bash
npm run build:mac    # macOS
npm run build:win    # Windows
npm run build:linux  # Linux
\`\`\`

## Testing
\`\`\`bash
npm test
npm run test:e2e
\`\`\`

## Documentation
- [Architecture](docs/ARCHITECTURE.md)
- [Security](docs/SECURITY.md)
- [Deployment](docs/DEPLOYMENT.md)
```

---

## 9. Priority Recommendations

### 🔴 CRITICAL (Block Production Release)

1. **Add Test Coverage** (Effort: 2-3 days)
   - Minimum 80% coverage required
   - Unit tests for cart logic
   - Integration tests for payment flow
   - E2E smoke tests

2. **Fix TypeScript Configuration** (Effort: 1 day)
   - Enable strict mode
   - Fix resulting type errors
   - Add proper null checks

3. **Implement Error Handling** (Effort: 1 day)
   - Add Error Boundary
   - Add try/catch in async functions
   - Add logging infrastructure

### 🟡 HIGH PRIORITY (Pre-Production)

4. **Remove Unused Dependencies** (Effort: 2 hours)
   - Reduces bundle by ~40%
   - Faster builds and app startup
   - Smaller installer size

5. **Add State Persistence** (Effort: 4 hours)
   - Cart survives app restart
   - Better UX
   - Prevents data loss

6. **Set Up CI/CD** (Effort: 4 hours)
   - Automated builds
   - Automated testing
   - Release automation

### 🟢 MEDIUM PRIORITY (Post-Launch)

7. **Performance Optimization** (Effort: 1 day)
   - Add memoization
   - Code splitting
   - Image lazy loading

8. **Add Auto-Update** (Effort: 1 day)
   - electron-updater integration
   - Secure update server
   - Delta updates

9. **Improve Documentation** (Effort: 1 day)
   - Architecture docs
   - Security policy
   - Contributing guidelines

### ⚪ LOW PRIORITY (Nice to Have)

10. **Add Analytics** (Effort: 1 day)
    - Usage tracking
    - Error reporting (Sentry)
    - Performance monitoring

11. **Accessibility Audit** (Effort: 1 day)
    - WCAG 2.1 AA compliance
    - Keyboard navigation
    - Screen reader support

12. **Internationalization** (Effort: 2 days)
    - i18n framework
    - Multiple languages
    - Currency localization

---

## 10. Security Checklist

- [x] Context isolation enabled
- [x] Node integration disabled
- [x] Sandbox enabled
- [x] Navigation prevention
- [x] IPC properly scoped
- [ ] Input validation (Zod schemas)
- [ ] CSP headers configured
- [ ] Code signing setup
- [ ] Auto-update with signature verification
- [ ] Dependency scanning in CI
- [ ] Security audit logs
- [ ] Principle of least privilege for IPC

---

## 11. Final Verdict

### Readiness Assessment

**Current State:** ⚠️ **NOT PRODUCTION READY**

**Blockers:**
1. Zero test coverage
2. Weak TypeScript configuration
3. No error handling
4. No logging

**Time to Production:** 5-7 days of focused work

**Recommended Path Forward:**

```
Week 1:
├─ Day 1: Enable strict TypeScript, fix errors
├─ Day 2-3: Add comprehensive test suite
├─ Day 4: Implement error handling & logging
├─ Day 5: Remove unused deps, optimize bundle
├─ Day 6: Set up CI/CD
└─ Day 7: Security audit, code signing

Week 2:
├─ QA testing
├─ Performance testing
├─ Security testing
└─ Soft launch preparation
```

### Code Quality Metrics

```
Architecture:     B+  (Very Good)
Security:         B   (Good, but gaps)
Code Quality:     C+  (Fair, needs strict TS)
Performance:      C   (Acceptable, needs optimization)
Testing:          F   (Critical gap)
Documentation:    C+  (Fair, needs updating)
Maintainability:  B   (Good structure)
Scalability:      B-  (Good for current scope)

OVERALL:          C+  (Satisfactory with caveats)
```

### Investment Recommendation

**Recommendation:** ✅ **PROCEED WITH IMPROVEMENTS**

This is a **solid foundation** that requires **focused quality improvements** before production deployment. The Electron architecture is excellent, the React code is clean, and the security fundamentals are strong.

**Investment required:** 40-50 engineering hours to reach production-grade quality.

**Risk Level:** Low-Medium (technical debt is manageable)

---

## Appendix A: Code Examples

### Recommended Refactoring

**Before:**
```typescript
// src/pages/Index.tsx (current)
const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (/* JSX */);
};
```

**After:**
```typescript
// src/hooks/useCart.ts (recommended)
export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? CartSchema.parse(JSON.parse(saved)) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((product: Product) => {
    const validated = ProductSchema.parse(product);

    setCart((prev) => {
      const existing = prev.find((item) => item.id === validated.id);
      if (existing) {
        logger.info('Item quantity increased', { productId: validated.id });
        return prev.map((item) =>
          item.id === validated.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      logger.info('Item added to cart', { productId: validated.id });
      return [...prev, { ...validated, quantity: 1 }];
    });
  }, []);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  return { cart, total, addToCart, /* ... */ };
};

// src/pages/Index.tsx (simplified)
const Index = () => {
  const { cart, total, addToCart, /* ... */ } = useCart();

  return (/* JSX */);
};
```

---

## Appendix B: Recommended Dependencies

### Add:
```json
{
  "devDependencies": {
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.5",
    "@playwright/test": "^1.40.0",
    "electron-builder-notarize": "^1.5.1",
    "electron-updater": "^6.1.7"
  },
  "dependencies": {
    "zustand": "^4.4.7" // Optional, if upgrading state management
  }
}
```

### Remove:
```json
{
  "dependencies": {
    "cmdk": "^1.1.1",  // Not used
    "recharts": "^2.15.4",  // Not used
    "embla-carousel-react": "^8.6.0",  // Not used
    "react-day-picker": "^8.10.1",  // Not used
    "react-hook-form": "^7.61.1",  // Not used
    "date-fns": "^3.6.0",  // Not used
    "vaul": "^0.9.9",  // Not used
    "react-resizable-panels": "^2.1.9",  // Not used
    "@hookform/resolvers": "^3.10.0",  // Not used
    "input-otp": "^1.4.2",  // Not used
    "next-themes": "^0.3.0"  // Not used (no theme switching)
  }
}
```

---

**End of Review**

For questions or clarifications, please contact the Principal Engineering team.
