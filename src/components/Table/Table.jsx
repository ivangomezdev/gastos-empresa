import { writeFile, utils } from 'xlsx';
import './Table.css';

function Table({ transactions, totalIngresos, totalEgresos, gastoNeto, startDate, endDate }) {
  const handleExportExcel = () => {
    const allData = transactions.map((tx) => ({
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

    const mainWorksheet = utils.json_to_sheet([
      ...allData,
      {},
      { Consecutivo: 'Total Ingresos', Monto: totalIngresos },
      { Consecutivo: 'Total Egresos', Monto: totalEgresos },
      { Consecutivo: 'Gasto Neto', Monto: gastoNeto },
    ]);

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, mainWorksheet, 'Transacciones');

    const lugares = [...new Set(transactions.map((tx) => tx.lugar))];
    lugares.forEach((lugar) => {
      const lugarTransactions = transactions.filter((tx) => tx.lugar === lugar);
      const lugarData = lugarTransactions.map((tx) => ({
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

      const ingresosLugar = lugarTransactions
        .filter((tx) => tx.tipoMovimiento === 'Ingreso')
        .reduce((sum, tx) => sum + tx.monto, 0);

      const egresosLugar = lugarTransactions
        .filter((tx) => tx.tipoMovimiento === 'Egreso')
        .reduce((sum, tx) => sum + tx.monto, 0);

      const netoLugar = ingresosLugar - egresosLugar;

      const lugarWorksheet = utils.json_to_sheet([
        ...lugarData,
        {},
        { Consecutivo: 'Total Ingresos', Monto: ingresosLugar },
        { Consecutivo: 'Total Egresos', Monto: egresosLugar },
        { Consecutivo: 'Gasto Neto', Monto: netoLugar },
      ]);

      const safeLugarName = lugar.replace(/[:\\\/\?\*\[\]]/g, '_').substring(0, 31);
      utils.book_append_sheet(workbook, lugarWorksheet, safeLugarName);
    });

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
      <div className="table__totals">
        <p className="table__total">Ingreso total: ${totalIngresos.toFixed(2)}</p>
        <p className="table__total">Egreso total: ${totalEgresos.toFixed(2)}</p>
        <p className="table__total">Gasto neto (Ingreso - Egreso): ${gastoNeto.toFixed(2)}</p>
      </div>
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
