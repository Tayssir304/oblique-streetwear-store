<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

function respond(int $status, array $body): never
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_SLASHES);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, ['error' => 'Method not allowed.']);
}

$request = json_decode(file_get_contents('php://input'), true);
if (!is_array($request)) {
    respond(400, ['error' => 'Invalid JSON request.']);
}

$customer = $request['customer'] ?? null;
$items = $request['items'] ?? null;
if (!is_array($customer) || !is_array($items) || count($items) < 1 || count($items) > 50) {
    respond(422, ['error' => 'Customer details and between 1 and 50 order items are required.']);
}

$name = $customer['name'] ?? null;
$email = $customer['email'] ?? null;
$address = $customer['address'] ?? null;
$paymentMethod = $customer['paymentMethod'] ?? '';

if (!is_string($name) || !is_string($email) || !is_string($address)) {
    respond(422, ['error' => 'Name, email, and shipping address must be text.']);
}
$name = trim($name);
$email = trim($email);
$address = trim($address);

if ($name === '' || strlen($name) > 120) {
    respond(422, ['error' => 'Enter a name of 1 to 120 characters.']);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254) {
    respond(422, ['error' => 'Enter a valid email address.']);
}
if ($address === '' || strlen($address) > 255) {
    respond(422, ['error' => 'Enter a shipping address of 1 to 255 characters.']);
}
if (!in_array($paymentMethod, ['card', 'cod'], true)) {
    respond(422, ['error' => 'Choose a supported payment method.']);
}

require_once __DIR__ . '/db.php';

try {
    $pdo = database();
    $productQuery = $pdo->prepare('SELECT name, price FROM products WHERE id = ?');
    $sizeQuery = $pdo->prepare('SELECT 1 FROM product_sizes WHERE product_id = ? AND size_name = ?');
    $colorQuery = $pdo->prepare('SELECT 1 FROM product_colors WHERE product_id = ? AND color_name = ?');
    $validatedItems = [];
    $subtotalCents = 0;

    foreach ($items as $item) {
        if (!is_array($item)) {
            respond(422, ['error' => 'An order item is invalid.']);
        }

        $productId = $item['productId'] ?? null;
        $size = $item['size'] ?? null;
        $color = $item['color'] ?? null;
        $quantity = $item['quantity'] ?? null;
        if (!is_string($productId) || !is_string($size) || !is_string($color) ||
            !is_int($quantity) || $quantity < 1 || $quantity > 99) {
            respond(422, ['error' => 'An order item has invalid product, size, color, or quantity.']);
        }

        $productQuery->execute([$productId]);
        $product = $productQuery->fetch();
        if (!$product) {
            respond(422, ['error' => 'An ordered product is not available.']);
        }

        $sizeQuery->execute([$productId, $size]);
        $colorQuery->execute([$productId, $color]);
        if (!$sizeQuery->fetchColumn() || !$colorQuery->fetchColumn()) {
            respond(422, ['error' => 'A selected size or color is not available for this product.']);
        }

        $unitPriceCents = (int) round((float) $product['price'] * 100);
        $subtotalCents += $unitPriceCents * $quantity;
        $validatedItems[] = [
            'productId' => $productId,
            'name' => $product['name'],
            'size' => $size,
            'color' => $color,
            'quantity' => $quantity,
            'unitPriceCents' => $unitPriceCents,
        ];
    }

    $shippingCents = $subtotalCents === 0 || $subtotalCents >= 25000 ? 0 : 1800;
    $totalCents = $subtotalCents + $shippingCents;
    $orderNumber = 'OBQ-' . strtoupper(bin2hex(random_bytes(4)));

    $pdo->beginTransaction();
    $orderQuery = $pdo->prepare(
        'INSERT INTO orders (order_number, customer_name, customer_email, shipping_address, payment_method, subtotal, shipping, total)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $orderQuery->execute([
        $orderNumber,
        $name,
        $email,
        $address,
        $paymentMethod,
        number_format($subtotalCents / 100, 2, '.', ''),
        number_format($shippingCents / 100, 2, '.', ''),
        number_format($totalCents / 100, 2, '.', ''),
    ]);

    $orderId = (int) $pdo->lastInsertId();
    $itemQuery = $pdo->prepare(
        'INSERT INTO order_items (order_id, product_id, product_name, size_name, color_name, quantity, unit_price)
         VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    foreach ($validatedItems as $item) {
        $itemQuery->execute([
            $orderId,
            $item['productId'],
            $item['name'],
            $item['size'],
            $item['color'],
            $item['quantity'],
            number_format($item['unitPriceCents'] / 100, 2, '.', ''),
        ]);
    }
    $pdo->commit();

    respond(201, ['orderNumber' => $orderNumber]);
} catch (Throwable $error) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log($error->getMessage());
    respond(500, ['error' => 'The order could not be saved. Check the PHP and MySQL server logs.']);
}
