const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://indskfailwnkwmojeclc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluZHNrZmFpbHdua3dtb2plY2xjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk1MTYwODYsImV4cCI6MjA0NTA5MjA4Nn0.NHaSk_3pDuJ0Et5a6JZbKmfRgxy5wygbIjy5PdWNzt8'; // Non dimenticare di sostituire con la tua chiave
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
