const supabase = require('../services/supabaseClient');

exports.getProgetti = async (req, res) => {
    const searchTerm = req.query.search || '';

    const { data, error } = await supabase
        .from('progetti')
        .select('id_progetto, nome_progetto')
        .ilike('nome_progetto', `%${searchTerm}%`);

    if (error) {
        console.error('Errore durante il recupero dei progetti:', error);
        return res.status(500).json({ message: 'Errore durante il recupero dei progetti', error });
    }

    res.json(data);
};