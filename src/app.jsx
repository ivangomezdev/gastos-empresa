import { useState, useEffect } from 'preact/hooks';
import Header from './components/Header/Header';
import Form from './components/Form/Form';
import Filter from './components/Filter/Filter';
import Table from './components/Table/Table';
import { getLugares, listenTransactions } from './lib/firebase';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [lugares, setLugares] = useState([]);
  const [filters, setFilters] = useState({ date: '', lugar: '', tipo: '' });
  const [error, setError] = useState('');

  // Fetch initial lugares and listen for transactions
  useEffect(() => {
    const fetchLugares = async () => {
      try {
        console.log('Fetching lugares');
        const lugs = await getLugares();
        setLugares(lugs);
      } catch (err) {
        console.error('Error fetching lugares:', err.message);
        setError('Error al cargar lugares. Verifique los permisos de Firebase.');
      }
    };
    fetchLugares();

    // Listen for transactions in real-time
    const unsubscribe = listenTransactions((txs) => {
      console.log('Transactions updated:', txs);
      setTransactions(txs);
    }, (err) => {
      console.error('Error listening to transactions:', err.message);
      setError('Error al cargar transacciones. Verifique los permisos de Firebase.');
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
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
