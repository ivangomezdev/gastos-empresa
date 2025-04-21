import * as XLSX from 'xlsx';

export function exportToExcel(transactions) {
  const worksheet = XLSX.utils.json_to_sheet(transactions.map((tx) => ({
    Consecutivo: tx.consecutivo,
    Fecha: tx.fecha,
    'Tipo de Movimiento': tx.tipoMovimiento,
    Monto: tx.monto,
    'Forma de Pago': tx.formaPago,
    Lugar: tx.lugar,
    Concepto: tx.concepto,
    Detalle: tx.detalle,
    Recibo: tx.recibo ? 'Sí' : 'No',
  })));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transacciones');
  XLSX.writeFile(workbook, 'transacciones.xlsx');
}