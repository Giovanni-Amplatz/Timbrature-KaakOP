const supabase = require('../services/supabaseClient');

exports.getFasi = async (req, res) => {
    const searchTerm = req.query.search || '';

    const { data, error } = await supabase
        .from('fasi')
        .select('id_fase, nome_fase')
        .ilike('nome_fase', `%${searchTerm}%`);

    if (error) {
        console.error('Errore durante il recupero delle fasi:', error);
        return res.status(500).json({ message: 'Errore durante il recupero delle fasi', error });
    }

    res.json(data);
};