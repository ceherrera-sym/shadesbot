const fs = require('fs');
const port = process.env.PORT || 4000;

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

client.on('disconnected', (reason) => {
    console.log('El cliente se desconectó. Intentando reconectar...');
    setTimeout(() => {
        client.initialize(); // Reintenta conectar después de un pequeño retraso
    }, 5000); // Espera 5 segundos antes de intentar reconectar
});


client.on('auth_failure', (message) => {
    console.error('Error de autenticación: ', message);
    // Aquí podrías implementar lógica adicional para reintentar o notificar.
});


// Escuchar mensajes en grupos
client.on('message', (message) => {
   // console.log(`Mensaje recibido de: ${message.from}`);

    const personalNumber = '5214773047419@c.us';

    // Verificar si el mensaje es un código y si está en los datos
    if (data && data[message.body]) {
        const response = data[message.body];

        const replyMessage =  'Respuesta automática\n\n' 
        
                            + 'CONDUCTOR: ' + response.conductor + '\n\n'
        
                            + 'AUTO 🚐:'  + response.auto + '\n\n'
        
                            + 'NÚMERO TELEFÓNICO📞: ' + response.telefono + '\n\n'
        
                            + 'GRUPO: ' + response.grupo + '\n\n'
        
                            + '*TIPO DE SANGRE*🩸: ' + response.tipoSangre + '\n\n'
        
                            + 'CONTACTO DE EMERGENCIA 🦺:  ' + response.contactoEmergencia ;
        

        client.sendMessage(message.from, replyMessage);

       
    }
});

// Iniciar el cliente
client.initialize();
