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

  const result = (await response.json()) as
    | CreateOrderResponse
    | { error: string };
  if (!response.ok) {
    throw new Error(
      'error' in result ? result.error : 'Unable to save your order.'
    );
  }
  if (!('orderNumber' in result) || typeof result.orderNumber !== 'string') {
    throw new Error('The server returned an invalid order confirmation.');
  }
  return result;
}
