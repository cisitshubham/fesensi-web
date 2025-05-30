import { Container } from '@/components/container';
import { generalSettings } from '@/config';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer w-full">  
      <Container>
        <div className="flex  flex-row  justify-between items-center gap-5 py-5">
          <div className="flex order-2 md:order-1  gap-2 font-normal text-2sm">
            <span className="text-gray-400">{currentYear} &copy;</span>
            <Link to="/" className="text-gray-400 hover:text-primary">
              Fesensi
            </Link>
          </div>
          <nav className="flex order-1 md:order-2 gap-4 font-normal text-2sm text-gray-400">
            <a href={generalSettings.docsLink} target="_blank" className="hover:text-primary">
              Docs
            </a>
            <a href="https://devs.keenthemes.com" target="_blank" className="hover:text-primary">
              Support
            </a>
            <a href="https://devs.keenthemes.com" target="_blank" className="hover:text-primary">
              FAQ
            </a>
          </nav>
        </div>
      </Container>
    </footer>
  );
};

export { Footer };
