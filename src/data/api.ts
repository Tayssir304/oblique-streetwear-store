interface CreateOrderRequest {
  customer: {
    name: string;
    email: string;
    address: string;
    paymentMethod: 'card' | 'cod';
  };
  items: Array<{
    productId: string;
    size: string;
    color: string;
    quantity: number;
  }>;
}

interface CreateOrderResponse {
  orderNumber: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export async function createOrder(
  order: CreateOrderRequest
): Promise<CreateOrderResponse> {
  let response: Response;
  try {
    response = await fetch('/api/orders.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
  } catch {
    throw new Error(
      'Unable to connect to the Oblique API. Check that the PHP server and MySQL are running.'
    );
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    throw new Error(
      'Online checkout is not connected. The PHP API needs a hosted server and database; your local XAMPP database cannot be reached by Vercel.'
    );
  }

  let result: unknown;
  try {
    result = await response.json();
  } catch {
    throw new Error('The checkout API returned invalid JSON. Please try again later.');
  }
  if (!isRecord(result)) {
    throw new Error('The checkout API returned an invalid response.');
  }

  if (!response.ok) {
    throw new Error(
      typeof result.error === 'string'
        ? result.error
        : 'Unable to save your order.'
    );
  }
  if (typeof result.orderNumber !== 'string') {
    throw new Error('The server returned an invalid order confirmation.');
  }
  return { orderNumber: result.orderNumber };
}
