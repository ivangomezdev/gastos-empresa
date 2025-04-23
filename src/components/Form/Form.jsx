import { useState } from 'preact/hooks';
import { addTransaction, addLugar, deleteLugar, uploadRecibo } from '../../lib/firebase';
import './Form.css';

const tiposMovimiento = ['Ingreso', 'Egreso'];
const formasPago = ['Efectivo', 'Transferencia', 'Tarjeta'];
const conceptos = [
  'Herramientas',
  'Equipo de trabajo',
  'Insumos',
  'Sueldos',
  'Bonos',
  'Servicios',
  'Renta',
  'Pagos',
  'Viáticos',
  'Otros',
];
const defaultLugares = [
  'Rancho Bonito',
  'Rancho Chiquito',
  'Texcalac',
  'Zacatelco',
  'Suegro',
  'Puebla',
  'General',
];

function Form({ lugares, onSubmit, onLugarAdded, onLugarDeleted }) {
  const [formData, setFormData] = useState({
    fecha: '',
    tipoMovimiento: '',
    monto: '',
    formaPago: '',
    lugar: '',
    concepto: '',
    detalle: '',
    recibo: null,
  });
  const [newLugar, setNewLugar] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = [
      'fecha',
      'tipoMovimiento',
      'monto',
      'formaPago',
      'lugar',
      'concepto',
    ];
    const isValid = requiredFields.every((field) => formData[field]);
    if (!isValid) {
      setError('Todos los campos requeridos deben estar completos.');
      return;
    }

    let reciboUrl = '';
    if (formData.recibo) {
      try {
        console.log('Uploading recibo to ImgBB:', formData.recibo.name);
        reciboUrl = await uploadRecibo(formData.recibo);
        console.log('Recibo uploaded, URL:', reciboUrl);
      } catch (err) {
        console.error('Recibo upload error:', err.message);
        setError('Error al subir el recibo a ImgBB. Guardando transacción sin recibo.');
        // Continue without recibo
      }
    }

    const transaction = {
      consecutivo: Date.now().toString(),
      fecha: formData.fecha,
      tipoMovimiento: formData.tipoMovimiento,
      monto: parseFloat(formData.monto),
      formaPago: formData.formaPago,
      lugar: formData.lugar,
      concepto: formData.concepto,
      detalle: formData.detalle,
      recibo: reciboUrl,
    };

    try {
      console.log('Saving transaction:', transaction);
      const docRef = await addTransaction(transaction);
      console.log('Transaction saved, ID:', docRef.id);
      onSubmit({ ...transaction, id: docRef.id });
      setFormData({
        fecha: '',
        tipoMovimiento: '',
        monto: '',
        formaPago: '',
        lugar: '',
        concepto: '',
        detalle: '',
        recibo: null,
      });
      setError('');
    } catch (err) {
      console.error('Transaction save error:', err.message);
      setError('Error al guardar la transacción. Verifique los permisos de Firestore.');
    }
  };

  const handleAddLugar = async () => {
    if (!newLugar) {
      setError('Por favor ingrese un nombre para el nuevo lugar.');
      return;
    }
    if (
      lugares.some((l) => l.nombre === newLugar) ||
      defaultLugares.includes(newLugar)
    ) {
      setError('El lugar ya existe.');
      return;
    }

    try {
      console.log('Adding lugar:', newLugar);
      await addLugar(newLugar);
      onLugarAdded({ nombre: newLugar, isCustom: true });
      setNewLugar('');
      setError('');
    } catch (err) {
      console.error('Add lugar error:', err.message);
      setError('Error al agregar el lugar. Verifique los permisos de Firestore.');
    }
  };

  const handleDeleteLugar = async (lugar) => {
    try {
      console.log('Deleting lugar:', lugar);
      await deleteLugar(lugar);
      onLugarDeleted(lugar);
      setError('');
    } catch (err) {
      console.error('Delete lugar error:', err.message);
      setError('Error al eliminar el lugar. Verifique los permisos de Firestore.');
    }
  };

  // Combine default and custom lugares
  const allLugares = [
    ...defaultLugares.map((nombre) => ({ nombre, isCustom: false })),
    ...lugares.filter((l) => !defaultLugares.includes(l.nombre)),
  ];

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2 className="form__title">Registrar Transacción</h2>
      {error && <p className="form__error">{error}</p>}
      <div className="form__group">
        <label className="form__label" htmlFor="fecha">
          Fecha
        </label>
        <input
          type="date"
          id="fecha"
          name="fecha"
          value={formData.fecha}
          onChange={handleChange}
          className="form__input"
        />
      </div>
      <div className="form__group">
        <label className="form__label" htmlFor="tipoMovimiento">
          Tipo de Movimiento
        </label>
        <select
          id="tipoMovimiento"
          name="tipoMovimiento"
          value={formData.tipoMovimiento}
          onChange={handleChange}
          className="form__input"
        >
          <option value="">Seleccionar</option>
          {tiposMovimiento.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
      </div>
      <div className="form__group">
        <label className="form__label" htmlFor="monto">
          Monto
        </label>
        <input
          type="number"
          id="monto"
          name="monto"
          value={formData.monto}
          onChange={handleChange}
          className="form__input"
          step="0.01"
        />
      </div>
      <div className="form__group">
        <label className="form__label" htmlFor="formaPago">
          Forma de Pago
        </label>
        <select
          id="formaPago"
          name="formaPago"
          value={formData.formaPago}
          onChange={handleChange}
          className="form__input"
        >
          <option value="">Seleccionar</option>
          {formasPago.map((forma) => (
            <option key={forma} value={forma}>
              {forma}
            </option>
          ))}
        </select>
      </div>
      <div className="form__group">
        <label className="form__label" htmlFor="lugar">
          Lugar
        </label>
        <select
          id="lugar"
          name="lugar"
          value={formData.lugar}
          onChange={handleChange}
          className="form__input"
        >
          <option value="">Seleccionar</option>
          {allLugares.map((lugar) => (
            <option key={lugar.nombre} value={lugar.nombre}>
              {lugar.nombre}
            </option>
          ))}
        </select>
        <div className="form__lugar-add">
          <input
            type="text"
            placeholder="Nuevo lugar"
            value={newLugar}
            onChange={(e) => setNewLugar(e.target.value)}
            className="form__input form__input--lugar"
          />
          <button
            type="button"
            onClick={handleAddLugar}
            className="form__button form__button--add"
          >
           +
          </button>
        </div>
        <div className="form__lugar-list">
          {allLugares.map((lugar) => (
            <div key={lugar.nombre} className="form__lugar-item">
              <span>{lugar.nombre}</span>
              {lugar.isCustom && (
                <button
                  type="button"
                  onClick={() => handleDeleteLugar(lugar.nombre)}
                  className="form__button form__button--delete"
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="form__group">
        <label className="form__label" htmlFor="concepto">
          Concepto
        </label>
        <select
          id="concepto"
          name="concepto"
          value={formData.concepto}
          onChange={handleChange}
          className="form__input"
        >
          <option value="">Seleccionar</option>
          {conceptos.map((concepto) => (
            <option key={concepto} value={concepto}>
              {concepto}
            </option>
          ))}
        </select>
      </div>
      <div className="form__group">
        <label className="form__label" htmlFor="detalle">
          Detalle
        </label>
        <textarea
          id="detalle"
          name="detalle"
          value={formData.detalle}
          onChange={handleChange}
          className="form__input form__input--textarea"
        />
      </div>
      <div className="form__group">
        <label className="form__label" htmlFor="recibo">
          Recibo (Archivo o Cámara)
        </label>
        <input
          type="file"
          id="recibo"
          name="recibo"
          accept="image/*"
          capture="environment"
          onChange={handleChange}
          className="form__input"
        />
      </div>
      <button type="submit" className="form__button form__button--submit">
        Guardar Transacción
      </button>
    </form>
  );
}

export default Form;