import { useState, useEffect } from 'preact/hooks';
import Header from './components/Header/Header';
import Form from './components/Form/Form';
import Filter from './components/Filter/Filter';
import Table from './components/Table/Table';
import { getLugares, listenTransactions } from './lib/firebase';
import './app.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [lugares, setLugares] = useState([]);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', lugar: '', tipo: '' });
  const [error, setError] = useState('');

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

    const unsubscribe = listenTransactions((txs) => {
      console.log('Transactions updated:', txs);
      setTransactions(txs);
    }, (err) => {
      console.error('Error listening to transactions:', err.message);
      setError('Error al cargar transacciones. Verifique los permisos de Firebase.');
    });

    return () => unsubscribe();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const filteredTransactions = transactions.filter((tx) => {
    const txDate = new Date(tx.fecha);
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;
    const matchesDate = (!startDate || txDate >= startDate) && (!endDate || txDate <= endDate);
    const matchesLugar = filters.lugar ? tx.lugar === filters.lugar : true;
    const matchesTipo = filters.tipo ? tx.tipoMovimiento === filters.tipo : true;
    return matchesDate && matchesLugar && matchesTipo;
  });

  const totalIngresos = filteredTransactions
    .filter((tx) => tx.tipoMovimiento === 'Ingreso')
    .reduce((sum, tx) => sum + tx.monto, 0);

  const totalEgresos = filteredTransactions
    .filter((tx) => tx.tipoMovimiento === 'Egreso')
    .reduce((sum, tx) => sum + tx.monto, 0);

  const gastoNeto = totalIngresos - totalEgresos;

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
            setLugares((prev) => prev.filter((lugar) => lugar.nombre !== deletedLugar));
          }}
        />
        <Filter
          lugares={lugares.map((l) => l.nombre)}
          onFilterChange={handleFilterChange}
          currentFilters={filters}
        />
        <Table
          transactions={filteredTransactions}
          totalIngresos={totalIngresos}
          totalEgresos={totalEgresos}
          gastoNeto={gastoNeto}
          startDate={filters.startDate}
          endDate={filters.endDate}
        />
      </main>
    </div>
  );
}

export default App;
