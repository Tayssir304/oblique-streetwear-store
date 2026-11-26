<?php
declare(strict_types=1);

function database(): PDO
{
    static $connection = null;
    if ($connection instanceof PDO) {
        return $connection;
    }

    $host = getenv('OBLIQUE_DB_HOST') ?: '127.0.0.1';
    $port = getenv('OBLIQUE_DB_PORT') ?: '3306';
    $name = getenv('OBLIQUE_DB_NAME') ?: 'oblique_store';
    $user = getenv('OBLIQUE_DB_USER');
    $password = getenv('OBLIQUE_DB_PASSWORD');
    if ($user === false || $user === '' || $password === false) {
        throw new RuntimeException('Set OBLIQUE_DB_USER and OBLIQUE_DB_PASSWORD before starting the API.');
    }

    $connection = new PDO(
        "mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4",
        $user,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );

    return $connection;
}
