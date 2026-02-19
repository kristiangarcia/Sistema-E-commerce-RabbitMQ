# Sistema E-commerce con RabbitMQ

Sistema de procesamiento de pedidos basado en microservicios y mensajería asíncrona con RabbitMQ.

## Arquitectura

```
Cliente HTTP
    │
    ▼
[Producer] ──── Cola: COLA_VEGETA ────► [Consumer]
 puerto 3000        RabbitMQ             Notificaciones
```

- **Producer** (`producer.js`): API REST que recibe pedidos y los encola.
- **Consumer** (`consumer.js`): Microservicio que procesa la cola y simula el envío de emails.

## Requisitos

- Node.js
- RabbitMQ

### Instalar RabbitMQ (macOS)

```bash
brew install rabbitmq
brew services start rabbitmq
```

## Instalación

```bash
npm install
```

## Ejecución

Se necesitan **dos terminales** abiertas simultáneamente.

**Terminal 1 — Producer (API de pedidos):**

```bash
node producer.js
```

**Terminal 2 — Consumer (Microservicio de notificaciones):**

```bash
node consumer.js
```

## Uso

Envía un pedido con `curl`:

```bash
curl -X POST http://localhost:3000/comprar \
  -H "Content-Type: application/json" \
  -d '{"id": 101, "producto": "Teclado", "email": "alumno@escuela.com"}'
```

O con PowerShell:

```powershell
Invoke-RestMethod -Uri http://localhost:3000/comprar -Method Post -ContentType "application/json" -Body '{"id": 101, "producto": "Teclado", "email": "alumno@escuela.com"}'
```

### Respuesta esperada

```json
{
  "mensaje": "¡Compra exitosa! Recibirás un correo de confirmación pronto.",
  "pedido_id": 101
}
```

## Flujo del sistema

1. El cliente envía un `POST /comprar` con los datos del pedido.
2. El **Producer** publica el mensaje en la cola `COLA_VEGETA` y responde inmediatamente al cliente.
3. El **Consumer** recibe el mensaje, simula el envío del email (5 segundos) y confirma a RabbitMQ que el trabajo terminó.
