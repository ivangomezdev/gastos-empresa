// src/components/Filter/Filter.jsx
import './Filter.css';

function Filter({ lugares, onFilterChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  return (
    <div className="filter">
      <h2 className="filter__title">Filtrar Transacciones</h2>
      <div className="filter__group">
        <label className="filter__label" htmlFor="date">
          Fecha
        </label>
        <input
          type="date"
          id="date"
          name="date"
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
          onChange={handleChange}
          className="filter__input"
        >
          <option value="">Todos</option>
          <option value="Ingreso">Ingreso</option>
          <option value="Egreso">Egreso</option>
        </select>
      </div>
    </div>
  );
}

export default Filter;