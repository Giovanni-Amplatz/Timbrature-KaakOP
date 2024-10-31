const supabase = require('../services/supabase');

exports.getTimbratori = async (req, res) => {
    try {
        const { data: timbratori, error } = await supabase
            .from('timbratori')
            .select('*');

        if (error) {
            throw error;
        }

        res.json(timbratori);
    } catch (error) {
        console.error('Errore durante il recupero dei timbratori:', error);
        res.status(500).json({ error: 'Errore durante il recupero dei timbratori.' });
    }
};