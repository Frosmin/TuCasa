'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, User } from 'lucide-react';

export default function Header() {
    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href={'/'} className="flex items-center">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={180}      
                        height={60}     
                        className="h-16 w-auto" 
                    />
                </Link>

                {/* Navigation Links */}
                <div className='flex items-center gap-8 text-sm font-medium'>
                     <Link
                        href={'/mapa'}
                        className='relative text-gray-700 font-bold hover:text-blue-600 transition-colors duration-300 group py-2'
                    >
                        Mapa
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300 ease-out"></span>
                    </Link>
                    <Link
                        href={'/ventas'}
                        className='relative text-gray-700 font-bold hover:text-blue-600 transition-colors duration-300 group py-2'
                    >
                        Ventas
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300 ease-out"></span>
                    </Link>
                    <Link
                        href={'/alquiler'}
                        className='relative text-gray-700 font-bold hover:text-blue-600 transition-colors duration-300 group py-2'
                    >
                        Alquiler
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300 ease-out"></span>
                    </Link>
                    <Link
                        href={'/anticretico'}
                        className='relative text-gray-700 font-bold hover:text-blue-600 transition-colors duration-300 group py-2'
                    >
                        Anticrético
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300 ease-out"></span>
                    </Link>
                    <Link
                        href={'/publicar'}
                        className='relative text-gray-700 font-bold hover:text-blue-600 transition-colors duration-300 group py-2'
                    >
                        Publicar
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300 ease-out"></span>
                    </Link>
                </div>

                {/* User Actions */}
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-105">
                        <Heart className="w-5 h-5" />
                        <span className="text-sm font-medium">Favoritos</span>
                    </button>
                    <button className="p-2 bg-gray-200 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:scale-110">
                        <User className="w-5 h-5 text-gray-600 hover:text-white transition-colors duration-300" />
                    </button>
                </div>
            </nav>
        </header>
    );
}