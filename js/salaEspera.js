import { firestoreDb, doc, getDoc, updateDoc } from './firebaseConfig.js';
import { realtimeDb } from './firebaseConfig.js';
import { ref, update, onValue } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

document.addEventListener('DOMContentLoaded', () => {
    const roomId = localStorage.getItem('roomId');
    const playerName = localStorage.getItem('playerName');
    const player1Name = localStorage.getItem('player1Name');
    const player2Name = localStorage.getItem('player2Name');
    const roomDocRef = doc(firestoreDb, 'rooms', roomId);

    if (roomId && playerName) {
        const playerField = playerName === player1Name ? 'player1' : 'player2';
        const playerStatusRef = ref(realtimeDb, `games/${roomId}/${playerField}`);

        document.getElementById('ready-btn').addEventListener('click', () => {
            update(playerStatusRef, { status: 'ready' }).catch((error) => {
                console.error('Error al actualizar el estado del jugador:', error);
            });
        });

        onValue(ref(realtimeDb, 'games/' + roomId), (snapshot) => {
            const data = snapshot.val();
            if (data) {
                if (data.player1 && data.player1.status === 'ready') {
                    document.getElementById('player1-status').textContent = 'Jugador 1: Listo';
                }
                if (data.player2 && data.player2.status === 'ready') {
                    document.getElementById('player2-status').textContent = 'Jugador 2: Listo';
                }
                if (data.player1 && data.player1.status === 'ready' && data.player2 && data.player2.status === 'ready') {
                    document.getElementById('start-game-btn').disabled = false;
                }
            }
        });
    } else {
        console.error('roomId o playerName es undefined o null.');
    }

    document.getElementById('start-game-btn').addEventListener('click', async () => {
        await updateDoc(roomDocRef, { status: 'playing' }).catch((error) => {
            console.error('Error al actualizar el estado a playing en Firestore:', error);
        });
        update(ref(realtimeDb, 'games/' + roomId), { status: 'playing' }).catch((error) => {
            console.error('Error al actualizar el estado a playing en Realtime Database:', error);
        });
        window.location.href = 'Game.html';
    });
});
