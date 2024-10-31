const supabase = require('../services/supabase');

exports.getTimbratureIncomplete = async (req, res) => {
    const { codice_matricola } = req.query;

    try {
        const { data: dipendente, error: erroreDipendente } = await supabase
            .from('dipendenti')
            .select('id_dipendente')
            .eq('codice_matricola', codice_matricola)
            .single();

        if (erroreDipendente) throw erroreDipendente;
        if (!dipendente) return res.status(404).json({ error: 'Dipendente non trovato' });

        const id_dipendente = dipendente.id_dipendente;

        const { data: timbratura, error: erroreTimbratura } = await supabase
            .from('timbrature')
            .select(`
              *,
              progetti (nome_progetto, id_progetto),
              tipo_attivita (nome_attivita),
              fasi (nome_fase)
          `)
            .eq('id_dipendente', id_dipendente)
            .is('ora_fine', null)
            .single();

        if (erroreTimbratura) throw erroreTimbratura;

        res.json(timbratura);
    } catch (error) {
        console.error('Errore durante la verifica della timbratura incompleta:', error);
        res.status(500).json({ error: 'Errore durante la verifica della timbratura incompleta.' });
    }
};

exports.createTimbratura = async (req, res) => {
    const { codice_matricola, ora_inizio, ora_fine, timbratore, attivita, fase, id_progetto, descrizione } = req.body;

    try {
        const { data: dipendenti, error: dipendenteError } = await supabase
            .from('dipendenti')
            .select('id_dipendente')
            .eq('codice_matricola', codice_matricola)
            .single();

        if (dipendenteError || !dipendenti) {
            return res.status(400).json({ error: 'Dipendente non trovato' });
        }

        const id_dipendente = dipendenti.id_dipendente;
        const { data: attivitaData, error: attivitaError } = await supabase
            .from('tipo_attivita')
            .select('id_attivita')
            .eq('nome_attivita', attivita)
            .single();

        if (attivitaError || !attivitaData) {
            return res.status(400).json({ error: 'Attività non trovata' });
        }

        const id_attivita = attivitaData.id_attivita;


        const { data: faseData, error: faseError } = await supabase
            .from('fasi')
            .select('id_fase')
            .eq('nome_fase', fase)
            .single();

        if (faseError || !faseData) {
            return res.status(400).json({ error: 'Fase non trovata' });
        }

        const id_fase = faseData.id_fase;

        const oraInizioUTC = new Date(ora_inizio);
        oraInizioUTC.setHours(oraInizioUTC.getHours() + 1);
        const oraFineUTC = new Date(ora_fine);
        oraFineUTC.setHours(oraFineUTC.getHours() + 1);

        const { error } = await supabase
            .from('timbrature')
            .insert([
                {
                    id_dipendente: id_dipendente,
                    id_progetto: id_progetto,
                    id_timbratore: timbratore,
                    id_attivita: id_attivita,
                    id_fase: id_fase,
                    ora_inizio: oraInizioUTC,
                    ora_fine: oraFineUTC,
                    descrizione,
                },
            ]);

        if (error) {
            console.error('Errore durante l\'inserimento della timbratura:', error);
            return res.status(500).json({ error: 'Errore durante l\'inserimento della timbratura' });
        }

        res.status(200).json({ message: 'Timbratura registrata con successo' });
    } catch (error) {
        console.error('Errore:', error);
        res.status(500).json({ error: 'Errore durante la registrazione della timbratura' });
    }
};

exports.updateTimbratura = async (req, res) => {
    const { id_dipendente, ora_fine } = req.body;

  const oraFineUTC = new Date(ora_fine);
  oraFineUTC.setHours(oraFineUTC.getHours() + 1);

  try {
    const { error } = await supabase
      .from('timbrature')
      .update({ ora_fine: oraFineUTC })
      .eq('id_dipendente', id_dipendente)
      .is('ora_fine', null);

    if (error) throw error;

    res.status(200).json({ message: 'Timbratura completata con successo' });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento della timbratura:', error);
    res.status(500).json({ error: 'Errore durante l\'aggiornamento della timbratura.' });
  }
};
