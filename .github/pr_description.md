## 🔒 Security Fix: Cross-Customer Data Leakage and Access Control

### Summary
This PR addresses critical security vulnerabilities in the AI Chat feature that allowed potential cross-customer data access and unauthorized store viewing.

### Type
- [x] Bug fix (Security)

### 🛡️ Security Issues Fixed

#### 1. Cross-Customer Data Leakage via Cache
**Problem:** The `/stores` endpoint used caching without proper user isolation, potentially allowing Customer A to see Customer B's stores.

**Solution:** Added `@NoCache()` decorator to the `/stores` endpoint to eliminate cache poisoning attack vector.

#### 2. Missing Workspace Ownership Validation
**Problem:** The `listStoresByWorkspace()` method only checked `workspaceId` from JWT without verifying the customer actually belongs to that workspace.

**Solution:** Added `customerId` parameter and validation to ensure customer belongs to the workspace.

#### 3. Store ID Access Without Ownership Check
**Problem:** AI endpoints (`/ai/command`, `/ai/conversations`, etc.) accepted any `storeId` parameter without validating ownership.

**Solution:** Added store ownership validation to all AI endpoints using `validateStoreAccessOrThrow()`.

#### 4. Conversation Access Without Store Validation
**Problem:** `listConversations()` only checked `customerId` without verifying the customer owns the store.

**Solution:** Added `validateStoreAccess()` check before querying conversations.

#### 5. Disconnected Stores Shown as Active
**Problem:** Frontend auto-selected any store regardless of connection status.

**Solution:** Filter stores by `status === 'connected'` before selection.

### 📁 Files Modified

**Backend:**
- `backend/src/modules/stores/controllers/store.controller.ts`
- `backend/src/modules/stores/services/store.service.ts`
- `backend/src/modules/ai/controllers/ai.controller.ts`
- `backend/src/modules/ai/services/ai.service.ts`

**Frontend:**
- `frontend/app/pages/dashboard/ai-chat.tsx`
- `frontend/app/components/layouts/DashboardSidebar.tsx`

### 🔍 Test Plan
- [x] Backend TypeScript compilation passes
- [x] Frontend TypeScript compilation passes
- [x] Backend production build succeeds
- [x] Frontend production build succeeds

### 📝 Deployment Notes
1. Clear Redis cache after deployment: `FLUSHDB`
2. Monitor for `ForbiddenException` errors in logs
3. Verify new users see empty store list until they add their own

### 🎯 Impact
- **Security Level:** Critical
- **Affected Users:** All customers
- **Breaking Changes:** None (enforces existing intended behavior)
