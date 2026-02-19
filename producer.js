const express = require('express');
const amqp = require('amqplib');

const app = express();
app.use(express.json());

const QUEUE_NAME = 'COLA_VEGETA';
let channel = null;

async function connectTorabbit(){
    try{

        //Conecatrse con server
        const connection = await amqp.connect('amqp://localhost');
        channel = await connection.createChannel();


        //Test existencia de cola
        await channel.assertQueue(QUEUE_NAME, {durable:true});

        console.log("Conectado");

    }catch(error){
        console.log("illo la emo liaoo")
    }
}

connectTorabbit();

// 2. Endpoint de Compra
app.post("/comprar", (req, res) => {
  const pedido = req.body; // Ej: {"id": 101, "producto": "Teclado", "email": "alumno@escuela.com"}

  // Validación básica
  if (!channel) return res.status(500).send("RabbitMQ no está listo");

  // 3. ENVIAR MENSAJE A LA COLA
  // Convertimos el objeto a texto y luego a Buffer (formato binario)
  const mensaje = JSON.stringify(pedido);
  channel.sendToQueue(QUEUE_NAME, Buffer.from(mensaje), { persistent: true });

  console.log(`Pedido enviado a la cola: ${pedido.id}`);

  // 4. Responder al usuario INMEDIATAMENTE (No esperamos el envío del correo)
  res.json({
    mensaje: "¡Compra exitosa! Recibirás un correo de confirmación pronto.",
    pedido_id: pedido.id,
  });
});

app.listen(3000, () => {
  console.log("Microservicio de Pedidos corriendo en puerto 3000");
});
