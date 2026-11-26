<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# OBLIQUE — Streetwear & Urban Archive

Local storefront with a PHP/MySQL checkout API for XAMPP.

## Run locally with XAMPP

1. Start **MySQL** in the XAMPP Control Panel.
2. Import [`database/schema.sql`](database/schema.sql) into MySQL:

   ```powershell
   C:\xampp\mysql\bin\mysql.exe --protocol=tcp -h 127.0.0.1 -P 3306 -u root < database\schema.sql
   ```

   The script creates the dedicated `oblique_store` database, product/variant seed data, and order tables. It does not modify other databases.
3. In phpMyAdmin's SQL tab, create a restricted application account. Replace the password with a unique, strong password:

   ```sql
   CREATE USER 'oblique_app'@'127.0.0.1' IDENTIFIED BY 'replace-with-a-strong-password';
   GRANT SELECT, INSERT ON oblique_store.* TO 'oblique_app'@'127.0.0.1';
   ```

4. In PowerShell, save the database credentials in your Windows user environment (not in project files):

   ```powershell
   [Environment]::SetEnvironmentVariable('OBLIQUE_DB_USER', 'oblique_app', 'User')
   [Environment]::SetEnvironmentVariable('OBLIQUE_DB_PASSWORD', 'replace-with-a-strong-password', 'User')
   $env:OBLIQUE_DB_USER = 'oblique_app'
   $env:OBLIQUE_DB_PASSWORD = 'replace-with-a-strong-password'
   ```

5. In a terminal at the project root, start the PHP API with XAMPP's PHP:

   ```powershell
   C:\xampp\php\php.exe -S 127.0.0.1:8000 -t .
   ```

6. In another terminal, start the storefront:

   ```powershell
   npm run dev
   ```

   Vite forwards `/api` requests to the PHP server. Open the local URL printed by Vite.

The database host, port, and database default to `127.0.0.1:3306` and `oblique_store`; the API requires `OBLIQUE_DB_USER` and `OBLIQUE_DB_PASSWORD` to be set explicitly. It does not fall back to MySQL's root account. The Vite development server binds to localhost only.

Check the API/database connection at `http://127.0.0.1:8000/api/health.php`. Checkout saves customer details and server-priced order items in MySQL. The demo records a selected payment method but does not process payments or send email.

## Deploying online

The PHP API and XAMPP database are for local development. Vercel does not run the local PHP process and cannot reach MySQL on your computer. Online checkout requires a hosted API and a hosted database; do not expose the XAMPP database directly to the internet.
