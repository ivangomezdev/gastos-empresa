import './Table.css';

function Table({ transactions }) {
  return (
    <div className="table">
      <h2 className="table__title">Transacciones</h2>
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