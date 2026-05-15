import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Unduh Foto — RuangGaya',
  description: 'Scan QR untuk unduh foto strip kamu dari RuangGaya.',
};

export default function ShareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
