export type HeaderProps = {
  title: string;
}

function Header({ title }: HeaderProps) {
  return (
    <nav className="navbar navbar-dark bg-primary">
      <div className="container">
        <span className="navbar-brand mb-0 h1">{ title }</span>
      </div>
    </nav>
  );
}

export default Header; 