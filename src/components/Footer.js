import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Student Marketplace. All rights reserved.</p>
      <ul className="footer-links">
        <li><Link href="/about">About</Link></li>
        <li><Link href="/contact">Contact</Link></li>
        <li><Link href="/faq">FAQ</Link></li>
      </ul>
    </footer>
  );
};

export default Footer;
