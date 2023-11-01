import React from 'react';

interface CardProps {
  children: React.ReactNode;
}

export default function Card({ children }: CardProps) {
  return (
    <div className='bg-slate-50 shadow-md rounded p-4 md:w-1/2 w-full'>
      {children}
    </div>
  );
}

