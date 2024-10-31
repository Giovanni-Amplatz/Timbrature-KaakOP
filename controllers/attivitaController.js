const supabase = require('../services/supabase');

exports.getAttivita = async (req, res) => {
  const searchTerm = req.query.search || '';

  const { data: attivita, error } = await supabase
    .from('tipo_attivita')
    .select('*')
    .ilike('nome_attivita', `%${searchTerm}%`);

  if (error) {
    console.error('Errore durante la query delle attività:', error);
    return res.status(500).json({ error: error.message });
  }

  res.json(attivita);
};
