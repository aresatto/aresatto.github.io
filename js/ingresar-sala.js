import { firestoreDb, doc, getDoc, updateDoc } from './firebaseConfig.js';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('join-room-btn').addEventListener('click', async function() {
        const playerName = localStorage.getItem('player2Name');
        const roomId = document.getElementById('room-code').value;

        console.log(`Intentando unirse a la sala con ID: ${roomId} y jugador: ${playerName}`);

        if (roomId.trim() !== "") {
            const roomDocRef = doc(firestoreDb, 'rooms', roomId);

            try {
                const roomDoc = await getDoc(roomDocRef);

                if (roomDoc.exists()) {
                    await updateDoc(roomDocRef, {
                        player2: playerName,
                        status: 'ready'
                    });
                    localStorage.setItem('playerName', playerName);
                    localStorage.setItem('roomId', roomId);
                    console.log(`Sala actualizada: ${roomId} con jugador2: ${playerName}`);
                    window.location.href = 'salaEspera.html';
                } else {
                    alert('ID de sala no válido.');
                    console.error('ID de sala no válido.');
                }
            } catch (error) {
                console.error("Error al unirse a la sala: ", error);
                alert("Hubo un problema al unirse a la sala. Intenta de nuevo.");
            }
        } else {
            alert('Por favor, ingresa el ID de la sala.');
        }
    });
});
