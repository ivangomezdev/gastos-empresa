import { exportToExcel } from '../../lib/excel';
import './Table.css';

function Table({ transactions }) {
  return (
    <div className="table-container">
      <div className="table-container__header">
        <h2 className="table-container__title">Transacciones</h2>
        <button
          className="table-container__button"
          onClick={() => exportToExcel(transactions)}
        >
          Exportar a Excel
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th className="table__header">Consecutivo</th>
            <th className="table__header">Fecha</th>
            <th className="table__header">Tipo</th>
            <th className="table__header">Monto</th>
            <th className="table__header">Forma de Pago</th>
            <th className="table__header">Lugar</th>
            <th className="table__header">Concepto</th>
            <th className="table__header">Detalle</th>
            <th className="table__header">Recibo</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.consecutivo} className="table__row">
              <td className="table__cell">{tx.consecutivo}</td>
              <td className="table__cell">{tx.fecha}</td>
              <td className="table__cell">{tx.tipoMovimiento}</td>
              <td className="table__cell">{tx.monto.toFixed(2)}</td>
              <td className="table__cell">{tx.formaPago}</td>
              <td className="table__cell">{tx.lugar}</td>
              <td className="table__cell">{tx.concepto}</td>
              <td className="table__cell">{tx.detalle}</td>
              <td className="table__cell">
                {tx.recibo ? (
                  <a href={URL.createObjectURL(tx.recibo)} target="_blank" rel="noopener noreferrer">
                    Ver
                  </a>
                ) : (
                  '-'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;