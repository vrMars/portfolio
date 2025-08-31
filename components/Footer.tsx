import React from 'react';
import { GitHubIcon } from './icons/GitHubIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { MediumIcon } from './icons/MediumIcon';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black/50 py-12">
      <div className="container mx-auto px-6 lg:px-8 text-center text-gray-400">
        <div className="flex justify-center space-x-6 mb-6">
          <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
            <GitHubIcon className="w-6 h-6" />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
            <LinkedInIcon className="w-6 h-6" />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
            <MediumIcon className="w-6 h-6" />
          </a>
        </div>
        <p>Designed & Built by Neelaksh Bhatia</p>
        <p className="text-sm mt-2">&copy; {new Date().getFullYear()}. All Rights Reserved.</p>
      </div>
    </footer>
  );
};