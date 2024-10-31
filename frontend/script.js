// frontend/script.js

document.addEventListener("DOMContentLoaded", async () => {
    const progettoInput = document.getElementById("progetto");
    const progettoSuggestionsDiv = document.getElementById("progetto-suggestions");
    const idProgettoInput = document.getElementById("id_progetto");
    const attivitaInput = document.getElementById("attivita");
    const attivitaSuggestionsDiv = document.getElementById("attivita-suggestions");
    const faseInput = document.getElementById("fase");
    const faseSuggestionsDiv = document.getElementById("fase-suggestions");
    const oraInizioInput = document.getElementById("ora_inizio");
    const codiceMatricolaInput = document.getElementById("codice_matricola");
    const incompleteBanner = document.getElementById("incomplete-timbratura-banner");
    const loadIncompleteTimbraturaButton = document.getElementById("loadIncompleteTimbratura");

    const now = new Date();
    now.setHours(now.getHours() + 1);
    oraInizioInput.value = now.toISOString().slice(0, 16);


    let timbraturaIncompletaId = null;


    async function loadTimbratori() {
        const response = await fetch("/api/timbratori");
        const timbratori = await response.json();
        const timbratoreSelect = document.getElementById("timbratore");


        timbratori.forEach((timbratore) => {
            const option = document.createElement("option");
            option.value = timbratore.id_timbratore;
            option.textContent = timbratore.nome_timbratore;
            timbratoreSelect.appendChild(option);
        });
    }

    await loadTimbratori();


    progettoInput.addEventListener("focus", async () => {
        await fetchProjects("");
    });

    progettoInput.addEventListener("input", async () => {
        const searchTerm = progettoInput.value;
        await fetchProjects(searchTerm);
    });

    async function fetchProjects(searchTerm) {
        const response = await fetch(`/api/progetti?search=${searchTerm}`);
        const progetti = await response.json();

        if (progetti.length > 0) {
            progettoSuggestionsDiv.innerHTML = "";
            progettoSuggestionsDiv.style.display = "block";
            progetti.forEach((progetto) => {
                const suggestionItem = document.createElement("div");
                suggestionItem.textContent = progetto.nome_progetto;
                suggestionItem.dataset.id = progetto.id_progetto;
                suggestionItem.style.cursor = "pointer";
                suggestionItem.onclick = () => {
                    progettoInput.value = progetto.nome_progetto;
                    idProgettoInput.value = progetto.id_progetto;
                    progettoSuggestionsDiv.style.display = "none";
                };
                progettoSuggestionsDiv.appendChild(suggestionItem);
            });
        } else {
            progettoSuggestionsDiv.style.display = "none";
        }
    }

    attivitaInput.addEventListener("focus", async () => {
        await fetchActivities("");
    });

    attivitaInput.addEventListener("input", async () => {
        const searchTerm = attivitaInput.value;
        await fetchActivities(searchTerm);
    });

    async function fetchActivities(searchTerm) {
        const response = await fetch(`/api/attivita?search=${searchTerm}`);
        const attivita = await response.json();

        if (attivita.length > 0) {
            attivitaSuggestionsDiv.innerHTML = "";
            attivitaSuggestionsDiv.style.display = "block";
            attivita.forEach((attivita) => {
                const suggestionItem = document.createElement("div");
                suggestionItem.textContent = attivita.nome_attivita;
                suggestionItem.dataset.id = attivita.id_attivita;
                suggestionItem.style.cursor = "pointer";
                suggestionItem.onclick = () => {
                    attivitaInput.value = attivita.nome_attivita;
                    attivitaSuggestionsDiv.style.display = "none";
                };
                attivitaSuggestionsDiv.appendChild(suggestionItem);
            });
        } else {
            attivitaSuggestionsDiv.style.display = "none";
        }
    }
    attivitaInput.addEventListener("focus", async () => {
        await fetchActivities("");
    })

    faseInput.addEventListener("focus", async () => {
        await fetchFasi("");
    });

    faseInput.addEventListener("input", async () => {
        const searchTerm = faseInput.value;
        await fetchFasi(searchTerm);
    });

    async function fetchFasi(searchTerm) {
        const response = await fetch(`/api/fasi?search=${searchTerm}`);
        const fasi = await response.json();

        if (fasi.length > 0) {
            faseSuggestionsDiv.innerHTML = "";
            faseSuggestionsDiv.style.display = "block";
            fasi.forEach((fase) => {
                const suggestionItem = document.createElement("div");
                suggestionItem.textContent = fase.nome_fase;
                suggestionItem.dataset.id = fase.id_fase;
                suggestionItem.style.cursor = "pointer";
                suggestionItem.onclick = () => {
                    faseInput.value = fase.nome_fase;
                    faseSuggestionsDiv.style.display = "none";
                };
                faseSuggestionsDiv.appendChild(suggestionItem);
            });
        } else {
            faseSuggestionsDiv.style.display = "none";
        }
    }

    codiceMatricolaInput.addEventListener("blur", async () => {
        const codiceMatricola = codiceMatricolaInput.value.trim();
        if (codiceMatricola === "") return;

        try {
            const response = await fetch(
                `/api/timbrature/incomplete?codice_matricola=${codiceMatricola}`
            );
            const timbratura = await response.json();
            if (timbratura && timbratura.ora_fine === null) {
                incompleteBanner.style.display = "block";
                loadIncompleteTimbraturaButton.onclick = () => {
                    document.getElementById("progetto").value =
                        timbratura.progetti.nome_progetto;
                    document.getElementById("timbratore").value =
                        timbratura.id_timbratore;
                    document.getElementById("attivita").value =
                        timbratura.tipo_attivita.nome_attivita;
                    document.getElementById("fase").value = timbratura.fasi.nome_fase;
                    document.getElementById("ora_inizio").value = new Date(
                        timbratura.ora_inizio
                    )
                        .toISOString()
                        .slice(0, 16);
                    timbraturaIncompletaId = timbratura.id_dipendente;

                    incompleteBanner.style.display = "none";
                };
            } else {
                incompleteBanner.style.display = "none";
            }

            if (data && data.nome_fase) {
                faseInput.value = data.nome_fase;
            }
        } catch (error) {
            console.error("Errore nel recupero della timbratura incompleta:", error);
        }
        try {
            const response = await fetch(`/api/dipendente-fase?codice_matricola=${codiceMatricola}`);
            const data = await response.json();

            if (data && data.nome_fase) {
                faseInput.value = data.nome_fase;
            }
        } catch (error) {
            console.error("Errore nel recupero della fase del dipendente:", error);
        }
    });

    document.addEventListener("click", (event) => {
        if (
            !progettoSuggestionsDiv.contains(event.target) &&
            event.target !== progettoInput
        ) {
            progettoSuggestionsDiv.style.display = "none";
        }
        if (
            !attivitaSuggestionsDiv.contains(event.target) &&
            event.target !== attivitaInput
        ) {
            attivitaSuggestionsDiv.style.display = "none";
        }
        if (
            !faseSuggestionsDiv.contains(event.target) &&
            event.target !== faseInput
        ) {
            faseSuggestionsDiv.style.display = "none";
        }
    });

    document.getElementById("timbraturaForm").onsubmit = function (event) {
        event.preventDefault();

        const formData = Object.fromEntries(new FormData(event.target));
        if (timbraturaIncompletaId)
            formData["id_dipendente"] = timbraturaIncompletaId;

        fetch("/api/timbrature", {
            method: timbraturaIncompletaId ? "PUT" : "POST",
            body: JSON.stringify(formData),
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((data) => {
                alert(data.message || "Timbratura completata con successo");
            })
            .catch((error) => console.error("Errore nella timbratura:", error));
            //reset form
            document.getElementById("timbraturaForm").reset();
            
        };
});
