# AI Healthcare – Skin Cancer Diagnosis Web Application

A browser-based AI application for skin cancer diagnosis using deep learning models in the ONNX format. All inference runs entirely on the client side via ONNX Runtime Web, ensuring that no image data is sent to any server.

**Live Demo:** [https://ai-healthcare-gamma.vercel.app](https://ai-healthcare-gamma.vercel.app)

---

## Overview

AI Healthcare is designed to assist in the early detection of skin cancer by analyzing skin lesion images. The application provides a risk assessment and actionable recommendations based on the analysis. It is built with Next.js (App Router), TypeScript, and ONNX Runtime Web for in-browser machine learning inference.

The platform also includes additional healthcare-related features such as appointments, consultations, medical records management, and knowledge resources.

---

## Features

- Upload skin lesion images for AI-based analysis directly in the browser.
- Powered by EfficientViT / ConvNeXtV2 models exported to ONNX format.
- Privacy-preserving: all processing is performed locally, with no server upload.
- Healthcare features:
  - Appointments booking & management
  - Doctor and consultation listings
  - Medical records & medication tracking
  - Knowledge base for healthcare education

---

## Technology Stack

- **Next.js 14** (App Router) with **TypeScript**
- **ONNX Runtime Web** (`onnxruntime-web`)
- **Tailwind CSS** and **shadcn/ui**
- **Lucide Icons**
- Deployed on **Vercel**

---

## Project Structure

```bash
ai_healthcare/
├── app/                     # Next.js App Router pages
│   ├── appointments/        # Appointment booking & history
│   ├── auth/                 # Authentication (e.g., login, signup)
│   ├── booking/              # Booking flow
│   ├── consultation/         # Consultations with doctors
│   ├── diagnosis/            # AI skin cancer diagnosis page
│   ├── doctors/              # Doctor listing and profiles
│   ├── knowledge/            # Educational healthcare articles
│   ├── medical-records/      # Patient medical records
│   ├── medications/          # Medication management
│   ├── notifications/        # User notifications
│   ├── profile/              # User profile
│   ├── search/               # Search functionality
│   ├── settings/             # User settings (including theme toggle)
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
│
├── components/               # Reusable UI components
├── hooks/                    # Custom React hooks
├── lib/                      # Utility functions and services
├── public/                   # Static assets (models, runtime files, images)
│   ├── models/               # ONNX models
│   └── ort/                  # ONNX Runtime Web WASM files
├── styles/                   # Additional styling files
├── next.config.mjs           # Next.js configuration
└── package.json

```
## Installation and Local Development
1. Clone the repository
```
git clone https://github.com/thanhhbao/ai_healthcare.git
cd ai_healthcare
```
2. Install dependencies
```
npm install
# or
yarn install
```
3. Prepare the ONNX model and runtime files

  Place your ONNX model file in public/models/model.onnx.
  
  Place ONNX Runtime Web WASM files (ort-wasm.wasm, ort-wasm-simd.wasm, etc.) in public/ort/.
  
  These runtime files can be obtained from the onnxruntime-web npm package (located in the dist/ directory).

4. Start the development server
```
npm run dev
# or
yarn dev
```
