import Icon from "./Icon.jsx";

export default function Header({ onHome, children }) {
  return (
    <header className="site-header">
      <div className="container">
        <button className="logo" onClick={onHome} aria-label="SHUFFLE home">
          <span className="logo-mark"><Icon name="shuffle" size={26} /></span>
          <span className="wordmark" aria-hidden="true">
            S<span className="p">H</span><span className="b">U</span>
            F<span className="p">F</span>L<span className="b">E</span><i />
          </span>
        </button>
        <nav className="nav">{children}</nav>
      </div>
    </header>
  );
}
