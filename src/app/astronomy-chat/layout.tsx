import React from 'react';

export const metadata = {
  title: 'Astronomy Chat with Claude',
  description: 'Chat about astronomy with Claude AI',
};

export default function AstronomyChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Astronomy Chat</h1>
      {children}
    </div>
  );
}