import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import logoMain from '../assets/RODIAX_logo_161x161.png';

// Map footer links to their corresponding routes
const linkRoutes = {
  'Command': '/products#command',
  'Embed': '/products#embed',
  'Rerank': '/products#rerank',
  'Fine-tuning': '/products#fine-tuning',
  'Pricing': '/products#pricing',
  'Playground': '/developers#playground',
  'LLM University': '/developers#llm-university',
  'Documentation': '/developers#documentation',
  'API Reference': '/developers#api-reference',
  'Responsible Use': '/developers#responsible-use',
  'About': '/company#about',
  'Blog': '/company#blog',
  'Research': '/company#research',
  'Careers': '/company#careers',
  'Newsroom': '/company#newsroom',
  'Twitter': 'https://twitter.com/rodiax_ai',
  'LinkedIn': 'https://linkedin.com/company/rodiax-ai',
  'Discord': 'https://discord.gg/rodiax',
  'Support': '/contact#support'
};

const footerSections = [
  {
    title: 'Products',
    links: ['Command', 'Embed', 'Rerank', 'Fine-tuning', 'Pricing'],
  },
  {
    title: 'Developers',
    links: [
      'Playground',
      'LLM University',
      'Documentation',
      'API Reference',
      'Responsible Use',
    ],
  },
  {
    title: 'Company',
    links: ['About', 'Blog', 'Research', 'Careers', 'Newsroom'],
  },
  {
    title: 'Contact',
    links: ['Twitter', 'LinkedIn', 'Discord', 'Support'],
  },
];

function Footer() {
  return (
    <motion.footer 
      className="bg-brand-background border-t border-brand-text/10 text-brand-text"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="max-w-screen-lg mx-auto px-6 py-16">
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {footerSections.map((section, sectionIndex) => (
            <motion.div 
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <motion.li 
                    key={link}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: (sectionIndex * 0.1) + (linkIndex * 0.05) }}
                    viewport={{ once: true }}
                  >
                    {linkRoutes[link]?.startsWith('http') ? (
                      <motion.a
                        href={linkRoutes[link]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-brand-text/80 hover:text-brand-accent transition-colors"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {link}
                      </motion.a>
                    ) : (
                      <Link
                        to={linkRoutes[link] || '#'}
                        className="text-sm text-brand-text/80 hover:text-brand-accent transition-colors"
                      >
                        <motion.span
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          {link}
                        </motion.span>
                      </Link>
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-16 pt-8 border-t border-brand-text/10 flex flex-col md:flex-row justify-between items-center gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <motion.img
              src={logoMain}
              alt="Rodiax Logo"
              className="h-8 w-auto object-contain"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            />
            <span className="text-sm text-brand-text/80">
              &copy; {new Date().getFullYear()} Rodiax. All rights reserved.
            </span>
          </motion.div>
          <div className="flex gap-6 text-sm text-brand-text/80">
            <Link
              to="/privacy"
              className="hover:text-brand-accent"
            >
              <motion.span
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                Privacy
              </motion.span>
            </Link>
            <Link
              to="/terms"
              className="hover:text-brand-accent"
            >
              <motion.span
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                Terms of Use
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}

export default Footer;
