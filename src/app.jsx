import { useState, useEffect } from 'preact/hooks';
import Header from './components/Header/Header';
import Form from './components/Form/Form';
import Filter from './components/Filter/Filter';
import Table from './components/Table/Table';
import { getTransactions, getLugares, initializeAuth } from './lib/firebase';
import './app.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [lugares, setLugares] = useState([]);
  const [filters, setFilters] = useState({ date: '', lugar: '', tipo: '' });
  const [error, setError] = useState('');

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Initializing authentication');
        await initializeAuth();
        console.log('Fetching initial data');
        const txs = await getTransactions();
        setTransactions(txs);
        const lugs = await getLugares();
        setLugares(lugs);
      } catch (err) {
        console.error('Error fetching initial data:', err.message);
        setError('Error al cargar datos iniciales. Verifique los permisos de Firebase.');
      }
    };
    fetchData();
  }, []);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Filter transactions based on state
  const filteredTransactions = transactions.filter((tx) => {
    const matchesDate = filters.date ? tx.fecha === filters.date : true;
    const matchesLugar = filters.lugar ? tx.lugar === filters.lugar : true;
    const matchesTipo = filters.tipo ? tx.tipoMovimiento === filters.tipo : true;
    return matchesDate && matchesLugar && matchesTipo;
  });

  return (
    <div className="app">
      <Header />
      {error && <p className="app__error">{error}</p>}
      <main className="app__main">
        <Form
          lugares={lugares}
          onSubmit={(tx) => {
            setTransactions((prev) => [...prev, tx]);
          }}
          onLugarAdded={(newLugar) => {
            setLugares((prev) => [...prev, newLugar]);
          }}
          onLugarDeleted={(deletedLugar) => {
            console.log('Lugar deleted in App:', deletedLugar);
            setLugares((prev) => prev.filter((lugar) => lugar.nombre !== deletedLugar));
          }}
        />
        <Filter lugares={lugares.map((l) => l.nombre)} onFilterChange={handleFilterChange} />
        <Table transactions={filteredTransactions} />
      </main>
    </div>
  );
}

export default App;