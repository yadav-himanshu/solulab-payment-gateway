# 💳 Premium Payment Gateway UI

A production-grade, secure, and highly interactive Payment Gateway UI built with **Next.js 14**, **TypeScript**, and **Zustand**. This project simulates a real-world payment workflow including smart card detection, life-cycle management, and idempotent retries—all without external payment SDKs.

## 🚀 Features

### 💎 Premium Experience
- **Glassmorphic UI**: Modern, sleek design with atmospheric gradients and backdrop blurs.
- **Interactive Card Preview**: Real-time synchronization with the form, featuring brand detection (Visa, Mastercard, Amex) and dynamic reflections.
- **Cinematic Feedback**: Full-screen status overlays with smooth animations for Processing, Success, and Error states.

### 🧠 Smart Logic
- **Real-time Validation**: Luhn algorithm for card numbers, smart expiry formatting, and CVV length validation based on card type.
- **Idempotency System**: Stable transaction IDs reused across retries to prevent duplicate processing.
- **Retry Mechanism**: Intelligent retry system (max 3 attempts) with state persistence.

### 🛡️ Robust Architecture
- **Clean Architecture**: Modular folder structure (`/components`, `/store`, `/utils`, `/types`).
- **State Management**: Centralized logic using Zustand with `localStorage` persistence.
- **Network Resilience**: 6-second request timeouts using `AbortController`.
- **Error Handling**: Mapping of technical errors to user-friendly, sanitized messages.

## 🛠️ Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State**: Zustand

## 📁 Project Structure
```text
/app             # App Router pages & API routes
/components      # Reusable UI & complex components
/store           # Global state (Zustand)
/utils           # Business logic (Validation, Card, Error)
/types           # Shared TypeScript interfaces
```

## 🏗️ Phase-wise Execution
1. **Setup**: Architecture & Design System
2. **UI Layer**: Payment Form & Core Components
3. **Logic**: Smart Card Formatting & Brand Detection
4. **Preview**: High-fidelity Card Visualization
5. **Lifecycle**: Payment State Transitions
6. **Backend**: Mock API Integration
7. **Resilience**: Timeout & Abort Handling
8. **Reliability**: Retry System Implementation
9. **Persistence**: Transaction History & Local Storage
10. **Consistency**: Idempotency Logic
11. **Safety**: Production-grade Error Handling
12. **Inclusivity**: Responsiveness & A11y (ARIA)
13. **UX Polish**: Micro-interactions & Animations
14. **Final**: Documentation & Cleanup

## 🚦 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

---
*Developed with focus on Security, Scalability, and User Experience.*

## 📝 Assumptions
- **Mock API Latency**: The simulated backend includes random delays (up to 8s) to test timeout handling and loading states.
- **Card Storage**: In a production environment, card details would never be stored in local storage. Here, only transaction history (masking card numbers) is persisted for demonstration.
- **Idempotency**: The `transactionId` is assumed to be the source of truth for idempotency on the server side.
- **Currency**: Currently limited to INR and USD for demonstration purposes.

## 🔮 Future Improvements
- **Security**: Integration with PCI-compliant tokenization services (e.g., Stripe, Braintree) to avoid handling raw card data.
- **Localization**: Full i18n support for multi-language and regional currency formatting.
- **Testing**: Implementation of Cypress/Playwright for end-to-end testing and Jest for unit testing business logic.
- **Form Persistence**: Saving draft payment info (excluding CVV) to session storage to prevent data loss on accidental refresh.
- **Advanced 3DS Simulation**: Adding a mock challenge-response step for 3D Secure verification.
