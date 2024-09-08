import Link from 'next/link';

const Navbar = () => {
    return (
      <header>
        <nav className="navbar">
          <div className="logo">
            <Link href="/">Student Marketplace</Link>
          </div>
          <ul className="nav-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/apartments">Apartments</Link></li>
            <li><Link href="/goods">Goods</Link></li>
            <li><Link href="/skills">Skills</Link></li>
            <li><Link href="/profile">Profile</Link></li>
          </ul>
        </nav>
      </header>
    );
  };
  
  export default Navbar;  