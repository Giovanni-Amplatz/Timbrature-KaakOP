const supabase = require('../services/supabaseClient');

exports.getDipendenteFase = async (req, res) => {
    const { codice_matricola } = req.query;

    try {
        const { data: dipendente, error: erroreDipendente } = await supabase
            .from('dipendenti')
            .select('fasi (nome_fase)')
            .eq('codice_matricola', codice_matricola)
            .single();

        if (erroreDipendente) throw erroreDipendente;
        if (!dipendente) return res.status(404).json({ error: 'Dipendente non trovato' });

        res.json(dipendente.fasi);
    } catch (error) {
        console.error('Errore nel recupero della fase del dipendente:', error);
        res.status(500).json({ error: 'Errore nel recupero della fase del dipendente.' });
    }
};