import React from 'react';
import type { ShaderConfig } from './background';
import { ShaderBackground } from './ShaderBackground';

interface AppLayoutProps {
  children: React.ReactNode;
  config: ShaderConfig;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, config }) => {
  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0a] text-white">

      <ShaderBackground {...config} />

      <main className="relative z-10 w-full">
        {children}
      </main>

    </div>
  );
};