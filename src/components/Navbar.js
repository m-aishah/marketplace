// components/Navbar.js
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav>
      <div className="logo">Student Marketplace</div>
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/apartments">Apartments</Link></li>
        <li><Link href="/goods">Goods</Link></li>
        <li><Link href="/skills">Skills</Link></li>
        <li><Link href="/profile">Profile</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;