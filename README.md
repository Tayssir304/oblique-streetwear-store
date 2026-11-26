# OBLIQUE — Contemporary Streetwear Store

A modern streetwear e-commerce experience inspired by contemporary urban fashion and Gen Z trends.

## Overview

OBLIQUE is a clothing-focused e-commerce platform designed around a modern dropshipping store concept. It showcases contemporary streetwear collections, including oversized hoodies, baggy denim, cargo pants, graphic tees and accessories.

The platform combines an interactive shopping experience with a modern editorial design.

## Features

- Interactive 3D product carousel
- Modern streetwear product catalogue
- Product details and descriptions
- Product size and color selection
- Shopping cart functionality
- Checkout and order submission
- PHP API integration
- MySQL database for products and orders
- Responsive interface

## Tech Stack

**Frontend**
- React
- TypeScript
- Tailwind CSS
- Vite
- Motion

**Backend**
- PHP
- MySQL
- PDO

## Project Structure

- `src/components/` — Reusable UI components
- `src/data/` — Product information and API integration
- `api/` — Backend endpoints
- `database/` — Database schema
- `public/` — Public assets

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Tayssir304/oblique-streetwear-store.git
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

### 4. Build the project

```bash
npm run build
```

## Database Setup

1. Create a MySQL database.
2. Import `database/schema.sql`.
3. Create an application user in phpMyAdmin's SQL tab. Replace the placeholder with a unique, strong password:

   ```sql
   CREATE USER 'oblique_app'@'127.0.0.1' IDENTIFIED BY 'replace-with-a-strong-password';
   GRANT SELECT, INSERT ON oblique_store.* TO 'oblique_app'@'127.0.0.1';
   ```

4. In PowerShell, configure the database credentials in your Windows user environment:

   ```powershell
   [Environment]::SetEnvironmentVariable('OBLIQUE_DB_USER', 'oblique_app', 'User')
   [Environment]::SetEnvironmentVariable('OBLIQUE_DB_PASSWORD', 'replace-with-a-strong-password', 'User')
   $env:OBLIQUE_DB_USER = 'oblique_app'
   $env:OBLIQUE_DB_PASSWORD = 'replace-with-a-strong-password'
   ```

5. Start the PHP API from the project root:

   ```powershell
   C:\xampp\php\php.exe -S 127.0.0.1:8000 -t .
   ```

6. In a separate terminal, start the storefront with `npm run dev`. Open the URL printed by Vite.

The API requires `OBLIQUE_DB_USER` and `OBLIQUE_DB_PASSWORD`; do not commit database credentials. Check the connection at `http://127.0.0.1:8000/api/health.php`. Checkout records orders in MySQL but does not process payments or send email.

## Deploying online

The PHP API and XAMPP database are for local development. Vercel cannot reach MySQL on your computer. Online checkout requires a hosted API and database; do not expose XAMPP directly to the internet.

## Project Goal

To create a modern online clothing store experience with a focus on contemporary streetwear, interactive product presentation and a simplified shopping journey.

## Status

Development project.

## Author

Developed by **Your Name**
