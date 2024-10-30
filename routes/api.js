const express = require('express');
const router = express.Router();

const attivitaController = require('../controllers/attivitaController');
const dipendentiController = require('../controllers/dipendentiController');
const fasiController = require('../controllers/fasiController');
const progettiController = require('../controllers/progettiController');
const timbratoriController = require('../controllers/timbratoriController');
const timbratureController = require('../controllers/timbratureController');

// Definisci le rotte qui
router.get('/progetti', progettiController.getProgetti); 
router.get('/attivita', attivitaController.getAttivita); 
router.get('/timbrature/incomplete', timbratureController.getTimbratureIncomplete);
router.get('/fasi', fasiController.getFasi); 
router.get('/timbratori', timbratoriController.getTimbratori);
router.get('/dipendente-fase', dipendentiController.getDipendenteFase);
router.post('/timbrature', timbratureController.createTimbratura);
router.put('/timbrature', timbratureController.updateTimbratura);

module.exports = router;
