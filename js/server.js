import express from 'express';
import { firestoreDb } from './firebaseConfig.js';
import { collection, addDoc, getDoc, doc, updateDoc } from 'firebase/firestore';

const app = express();
const port = 3000;
app.use(express.json());

app.post('/createRoom', async (req, res) => {
    const { playerName } = req.body;
    const roomData = { player1: playerName, player2: null, status: 'waiting', player1Score: 0, player2Score: 0 };
    try {
        const docRef = await addDoc(collection(firestoreDb, 'rooms'), roomData);
        res.status(201).send({ roomId: docRef.id });
    } catch (error) {
        res.status(500).send({ error: 'Error creating room: ' + error.message });
    }
});

app.post('/joinRoom', async (req, res) => {
    const { playerName, roomId } = req.body;
    try {
        const roomRef = doc(firestoreDb, 'rooms', roomId);
        const roomDoc = await getDoc(roomRef);
        if (!roomDoc.exists) {
            res.status(404).send({ error: 'Room not found' });
        } else {
            await updateDoc(roomRef, { player2: playerName, status: 'ready' });
            res.status(200).send({ success: 'Joined room successfully' });
        }
    } catch (error) {
        res.status(500).send({ error: 'Error joining room: ' + error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
