import './Filter.css';

const tiposMovimiento = ['Ingreso', 'Egreso'];

function Filter({ lugares, onFilterChange, currentFilters }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  return (
    <div className="filter">
      <h2 className="filter__title">Filtrar Transacciones</h2>
      <div className="filter__group">
        <label className="filter__label" htmlFor="startDate">
          Fecha Inicio
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={currentFilters.startDate}
          onChange={handleChange}
          className="filter__input"
        />
      </div>
      <div className="filter__group">
        <label className="filter__label" htmlFor="endDate">
          Fecha Fin
        </label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={currentFilters.endDate}
          onChange={handleChange}
          className="filter__input"
        />
      </div>
      <div className="filter__group">
        <label className="filter__label" htmlFor="lugar">
          Lugar
        </label>
        <select
          id="lugar"
          name="lugar"
          value={currentFilters.lugar}
          onChange={handleChange}
          className="filter__input"
        >
          <option value="">Todos</option>
          {lugares.map((lugar) => (
            <option key={lugar} value={lugar}>
              {lugar}
            </option>
          ))}
        </select>
      </div>
      <div className="filter__group">
        <label className="filter__label" htmlFor="tipo">
          Tipo de Movimiento
        </label>
        <select
          id="tipo"
          name="tipo"
          value={currentFilters.tipo}
          onChange={handleChange}
          className="filter__input"
        >
          <option value="">Todos</option>
          {tiposMovimiento.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Filter;