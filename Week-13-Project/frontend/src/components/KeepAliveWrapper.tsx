// KeepAliveWrapper.tsx
import { KeepAlive } from 'react-activation';

export default function KeepAliveWrapper({ children }: { children: ReactNode }) {
  return <KeepAlive>{children}</KeepAlive>;
}
