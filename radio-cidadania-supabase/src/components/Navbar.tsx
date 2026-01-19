import { Link, useLocation } from 'wouter';
import { Radio, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Início' },
    { href: '/programacao', label: 'Programação' },
    { href: '/contato', label: 'Contato' },
  ];

  const isActive = (href: string) => location === href;

  return (
    <nav className="bg-primary text-white shadow-lg sticky top-0 z-40">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Radio className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight">Blog Cidadania FM</h1>
                <p className="text-xs text-white/80">FM 87.9</p>
              </div>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  className={`font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-secondary'
                      : 'text-white hover:text-secondary'
                  }`}
                >
                  {link.label}
                </a>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  className={`block py-2 font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-secondary'
                      : 'text-white hover:text-secondary'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
