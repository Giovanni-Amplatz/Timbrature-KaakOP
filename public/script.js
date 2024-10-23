document.addEventListener('DOMContentLoaded', async () => {
    await loadTimbratori();
    await loadFasi(); // Carica le fasi all'inizio
    
    document.getElementById('timbraturaForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            codice_matricola: document.getElementById('codiceMatricola').value,
            id_progetto: document.getElementById('progetto').value,
            id_timbratore: document.getElementById('timbratore').value,
            id_attivita: document.getElementById('tipoAttivita').value,
            id_fase: document.getElementById('fase').value,
            tipo_timbratura: document.getElementById('tipoTimbratura').value,
            descrizione: document.getElementById('descrizione').value
        };

        const response = await fetch('/timbrature', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            alert('Timbratura inserita con successo!');
            // Resetta il modulo dopo l'invio
            document.getElementById('timbraturaForm').reset();
            // Ricarica i tipi di attività e fasi
            await loadAttivita();
            await loadFasi();
        } else {
            alert('Errore: ' + result.error);
        }
    });

    document.getElementById('searchButton').addEventListener('click', async () => {
        const codiceMatricola = document.getElementById('searchCodiceMatricola').value;
        const response = await fetch(`/timbrature?codice_matricola=${codiceMatricola}`);
        const results = await response.json();

        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = ''; // Pulisci i risultati precedenti

        if (results.length > 0) {
            results.forEach(timbratura => {
                const div = document.createElement('div');
                div.textContent = `ID: ${timbratura.id_timbratura}, Progetto: ${timbratura.id_progetto}, Tipo: ${timbratura.tipo_timbratura}, Ora Inizio: ${timbratura.ora_inizio}`;
                resultsDiv.appendChild(div);
            });
        } else {
            resultsDiv.textContent = 'Nessuna timbratura trovata.';
        }
    });

    // Aggiungi un evento per caricare i tipi di attività quando il progetto cambia
    document.getElementById('progetto').addEventListener('change', async () => {
        const idProgetto = document.getElementById('progetto').value;
        await loadAttivita(idProgetto);
        await loadFasi(); // Carica le fasi quando il progetto cambia
    });
});

// Funzione per caricare i timbratori
async function loadTimbratori() {
    const response = await fetch('/timbratori');
    const timbratori = await response.json();

    const timbratoreSelect = document.getElementById('timbratore');
    timbratori.forEach(timbratore => {
        const option = document.createElement('option');
        option.value = timbratore.id_timbratore;
        option.textContent = timbratore.nome_timbratore;
        timbratoreSelect.appendChild(option);
    });
}

// Funzione per caricare i tipi di attività in base al progetto selezionato
async function loadAttivita(idProgetto) {
    const response = await fetch(`/tipo_attivita?id_progetto=${idProgetto}`);
    const attivita = await response.json();

    console.log('Attività caricate:', attivita); // Aggiungi questa riga

    const tipoAttivitaSelect = document.getElementById('tipoAttivita');
    tipoAttivitaSelect.innerHTML = '<option value="">Seleziona Tipo Attività</option>'; // Pulisci le opzioni esistenti

    attivita.forEach(attivita => {
        const option = document.createElement('option');
        option.value = attivita.id_attivita;
        option.textContent = attivita.nome_attivita;
        tipoAttivitaSelect.appendChild(option);
    });
}


// Funzione per caricare le fasi
async function loadFasi() {
    const response = await fetch('/fasi'); // Assicurati di avere un endpoint per ottenere le fasi
    const fasi = await response.json();

    const faseSelect = document.getElementById('fase');
    faseSelect.innerHTML = '<option value="">Seleziona Fase</option>'; // Pulisci le opzioni esistenti

    fasi.forEach(fase => {
        const option = document.createElement('option');
        option.value = fase.id_fase;
        option.textContent = fase.nome_fase;
        faseSelect.appendChild(option);
    });
}
