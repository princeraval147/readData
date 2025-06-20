# 💎 Diamond Stock Management Platform

> ⚠️ **Private Internal Application**  
This project is developed by **Platinum Tech** for internal use by verified diamond companies. Installation or redistribution is not permitted.

---

## 📌 Overview

A secure, web-based diamond stock management system designed for:

- Uploading stock via Excel/CSV
- Filtering and exporting visible diamond data
- Sharing stock securely via tokenized API
- Viewing diamond videos/images
- Managing company-specific inventories

---

## 🔐 Access Control

- Only approved users with access tokens can:
  - Upload stock
  - Share API links
  - View or export data

---

## 📄 Excel Upload Format

Minimum required fields:  
`Weight`, `Clarity`

Other accepted fields will be auto-normalized (e.g., `MEASUREMENT1` → `LENGTH`).

---

## 📤 Export Format

- Exports only the data shown in the current table view (with filters).
- If no data is available, only column headers are exported.
- Each row includes a generated `ID` field based on its table index.

---

## 🔄 API Sharing

- Unique API tokens generated per user
- Tokens sent via email for external access
- Only selected stock is shared securely via `/v1/all-stock` endpoint

---

## ⚙️ Deployment

> 🛠️ Deployment is managed internally.  
> No public installation, cloning, or third-party hosting is allowed.

---

## 📧 Contact & Support

**Company:** Platinum Tech  
**Support Email:** princeraval147@gmail.com

If you're an authorized partner and need access, please contact us directly.

---

## 🏷️ License

This software is proprietary.  
© Platinum Tech – All rights reserved.
