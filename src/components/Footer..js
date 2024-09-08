import Link from 'next/link';

const Footer = () => {
  return (
    <footer>
      <p>&copy; 2024 Student Marketplace</p>
      <ul>
        <li><Link href="/about">About</Link></li>
        <li><Link href="/contact">Contact</Link></li>
        <li><Link href="/faq">FAQ</Link></li>
      </ul>
    </footer>
  );
};

export default Footer;
