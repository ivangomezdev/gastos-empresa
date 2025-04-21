import './Header.css';

function Header() {
  return (
    <header className="header">
      <img src="/logo.png" alt="Logo" className="header__logo" />
      <h1 className="header__title">Gestión de Transacciones</h1>
    </header>
  );
}

export default Header;
