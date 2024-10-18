const fs = require('fs');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Crear un nuevo cliente de WhatsApp Web
const client = new Client({
    authStrategy: new LocalAuth(),
});

// Cargar los datos desde el archivo JSON
let data;
fs.readFile('data.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("Error leyendo el archivo:", err);
        return;
    }
    try {
        data = JSON.parse(jsonString);
    } catch (err) {
        console.log('Error parsing JSON:', err);
    }
});

// Mostrar el código QR en la terminal
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

// Cuando el cliente esté listo
client.on('ready', () => {
    console.log('Bot de WhatsApp está listo.');
});

// Escuchar mensajes en grupos
client.on('message', (message) => {
    console.log(`Mensaje recibido de: ${message.from}`);

    const personalNumber = '5214773047419@c.us';

    // Verificar si el mensaje es un código y si está en los datos
    if (data && data[message.body]) {
        const response = data[message.body];
        const replyMessage = `Respuesta automática

        CONDUCTOR: ${response.conductor}

        AUTO 🚐: ${response.auto}

        NÚMERO TELEFÓNICO📞: ${response.telefono}

        GRUPO: ${response.grupo}

        *TIPO DE SANGRE*🩸: ${response.tipoSangre}

        CONTACTO DE EMERGENCIA 🦺: ${response.contactoEmergencia}`;

        client.sendMessage(message.from, replyMessage);

         // También responderte directamente a ti
         if (message.from === personalNumber) {
            client.sendMessage(message.from, replyMessage);
        }
    }
});

// Iniciar el cliente
client.initialize();
