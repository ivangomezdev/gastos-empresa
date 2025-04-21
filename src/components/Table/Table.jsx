import { writeFile, utils } from 'xlsx';
import './Table.css';

function Table({ transactions, totalExpenses, startDate, endDate }) {
  const handleExportExcel = () => {
    const data = transactions.map((tx) => ({
      Consecutivo: tx.consecutivo,
      Fecha: tx.fecha,
      Tipo: tx.tipoMovimiento,
      Monto: tx.monto,
      'Forma de Pago': tx.formaPago,
      Lugar: tx.lugar,
      Concepto: tx.concepto,
      Detalle: tx.detalle || '',
      Recibo: tx.recibo || '',
    }));

    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Transacciones');
    writeFile(workbook, 'transacciones.xlsx');
  };

  return (
    <div className="table">
      <h2 className="table__title">Transacciones</h2>
      <div className="table__actions">
        <button
          className="table__button table__button--export"
          onClick={handleExportExcel}
        >
          Descargar Excel
        </button>
      </div>
      {startDate && endDate && (
        <p className="table__total">
          Gastos del {startDate} al {endDate}: ${totalExpenses.toFixed(2)}
        </p>
      )}
      <p className="table__total">
        Gasto total: ${totalExpenses.toFixed(2)}
      </p>
      <table className="table__content">
        <thead>
          <tr>
            <th>Consecutivo</th>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Monto</th>
            <th>Forma de Pago</th>
            <th>Lugar</th>
            <th>Concepto</th>
            <th>Detalle</th>
            <th>Recibo</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="9" className="table__empty">
                No hay transacciones para mostrar
              </td>
            </tr>
          ) : (
            transactions.map((tx) => (
              <tr key={tx.id}>
                <td>{tx.consecutivo}</td>
                <td>{tx.fecha}</td>
                <td>{tx.tipoMovimiento}</td>
                <td>${tx.monto.toFixed(2)}</td>
                <td>{tx.formaPago}</td>
                <td>{tx.lugar}</td>
                <td>{tx.concepto}</td>
                <td>{tx.detalle || '-'}</td>
                <td>
                  {tx.recibo ? (
                    <a
                      href={tx.recibo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="table__recibo-icon"
                      title="Ver recibo"
                    >
                      📄
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;