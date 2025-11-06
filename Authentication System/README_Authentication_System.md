# 🔐 Authentication System

## Overview
A Python-based **Two-Factor Authentication (2FA)** system that combines password encryption, TOTP-based verification using Google Authenticator, and secure session management.

## Key Features
- Secure registration and login with password strength validation.
- Passwords encrypted with **bcrypt**.
- TOTP generation using **pyotp** and QR code setup for Google Authenticator.
- Backup recovery codes for emergency access.
- SQLite-based session tracking with expiry validation.

## Tech Stack
`Python`, `pyotp`, `bcrypt`, `qrcode`, `pillow`, `sqlite3`, `secrets`, `datetime`

## How to Run
1. Open the notebook `2FA_AUTHENTICATION_SYSTEM.ipynb`.
2. Run all cells sequentially.
3. Follow the terminal instructions to register, verify, and log in using Google Authenticator.

## Outcome
A working secure login flow replicating modern 2FA systems used in real-world applications.
