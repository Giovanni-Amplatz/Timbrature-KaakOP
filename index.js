// index.js
const express = require('express');
const bodyParser = require('body-parser');
const supabase = require('./supabase');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// API per aggiungere una nuova timbratura
app.post('/timbrature', async (req, res) => {
    const { codice_matricola, id_progetto, id_timbratore, id_fase, tipo_timbratura, descrizione } = req.body;

    try {
        // Recupera l'ora corrente
        const ora_inizio = new Date().toISOString();

        // Trova il dipendente tramite codice matricola
        const { data: dipendente, error: dipendenteError } = await supabase
            .from('dipendenti')
            .select('id_dipendente, fase')
            .eq('codice_matricola', codice_matricola)
            .single();

        if (dipendenteError || !dipendente) {
            return res.status(400).json({ error: 'Dipendente non trovato' });
        }

        // Trova il tipo di attività legato al progetto
        const { data: attivita, error: attivitaError } = await supabase
            .from('tipo_attivita')
            .select('id_attivita')
            .eq('id_progetto', id_progetto)
            .single();

        if (attivitaError || !attivita) {
            return res.status(400).json({ error: 'Tipo di attività non trovato per il progetto' });
        }

        // Inserisci la nuova timbratura nel database
        const { data, error } = await supabase
            .from('timbrature')
            .insert([
                {
                    id_dipendente: dipendente.id_dipendente,
                    id_progetto: id_progetto,
                    id_attivita: attivita.id_attivita,
                    id_fase: dipendente.fase || id_fase,
                    id_timbratore: id_timbratore,
                    ora_inizio: ora_inizio,
                    tipo_timbratura: tipo_timbratura,
                    descrizione: descrizione
                }
            ]);

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API per cercare timbrature
/*app.get('/timbrature', async (req, res) => {
    const { codice_matricola, id_progetto, tipo_timbratura } = req.query;

    try {
        let query = supabase
            .from('timbrature')
            .select('id_timbratura, id_dipendente, id_progetto, tipo_timbratura, ora_inizio, ora_fine, descrizione');

        if (codice_matricola) {
            const { data: dipendente } = await supabase
                .from('dipendenti')
                .select('id_dipendente')
                .eq('codice_matricola', codice_matricola)
                .single();
            
            if (dipendente) {
                query = query.eq('id_dipendente', dipendente.id_dipendente);
            }
        }

        if (id_progetto) {
            query = query.eq('id_progetto', id_progetto);
        }

        if (tipo_timbratura) {
            query = query.eq('tipo_timbratura', tipo_timbratura);
        }

        const { data, error } = await query;

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});*/

app.post('/timbrature', async (req, res) => {
    const { codice_matricola, id_progetto, id_timbratore, id_attivita, id_fase, tipo_timbratura, descrizione } = req.body;

    // Controllo dei dati richiesti
    if (!codice_matricola || !id_progetto || !id_timbratore || !id_attivita || !id_fase || !tipo_timbratura) {
        return res.status(400).json({ error: 'Tutti i campi obbligatori devono essere compilati.' });
    }

    const ora_inizio = new Date().toISOString();

    try {
        const { data, error } = await supabase
            .from('timbrature')
            .insert([{ codice_matricola, id_progetto, id_timbratore, id_attivita, id_fase, tipo_timbratura, ora_inizio, descrizione }]);

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API per ottenere i timbratori
app.get('/timbratori', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('timbratori')
            .select('*');

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API per ottenere i tipi di attività in base al progetto
app.get('/tipo_attivita', async (req, res) => {
    const { id_progetto } = req.query;

    try {
        const { data, error } = await supabase
            .from('tipo_attivita')
            .select('*')
            .eq('id_progetto', id_progetto); // Filtra per id_progetto

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// Endpoint per ottenere tutte le fasi
app.get('/fasi', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('fasi')
            .select('*');

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Avvio del server
app.listen(port, () => {
    console.log(`Server in esecuzione su http://localhost:${port}`);
});
