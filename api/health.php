<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    header('Allow: GET');
    echo json_encode(['error' => 'Method not allowed.']);
    exit;
}

require_once __DIR__ . '/db.php';

try {
    $count = (int) database()->query('SELECT COUNT(*) FROM products')->fetchColumn();
    echo json_encode(['ok' => true, 'products' => $count]);
} catch (Throwable $error) {
    error_log($error->getMessage());
    http_response_code(503);
    echo json_encode(['error' => 'Database is unavailable. Import database/schema.sql and check the database settings.']);
}
