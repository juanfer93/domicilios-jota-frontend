'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/UseAuthStore';
import { NewPedidoNotification } from './NewPedidoNotification';

export default function ProfileDeliveryClient() {
  const router = useRouter();

  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const isDomiciliario =
    !!user && user.rol && user.rol.toLowerCase() === 'domiciliario';

  const saldoNumero = user?.saldo ?? 0;
  const saldoFormateado = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(saldoNumero);

  const handleLogout = () => {
    clearAuth();
    router.replace('/login');
  };

  useEffect(() => {
    if (!token || !user) {
      router.replace('/login');
      return;
    }

    if (!isDomiciliario) {
      router.replace('/dashboard');
    }
  }, [token, user, isDomiciliario, router]);

  if (!token || !user || !isDomiciliario) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9E8] text-[#030303ff]">
      <header className="bg-[#174A8B] text-[#FFF9E8] pt-6 pb-4 flex flex-col items-center shadow-md">
        <div className="bg-[#FFF9E8] rounded-md px-4 py-2 mb-3">
          <span className="text-[#174A8B] font-extrabold tracking-widest text-sm">
            DOMICILIOS JOTA JOTA
          </span>
        </div>

        <p className="text-lg font-semibold">
          Saldo:{' '}
          <span className="font-bold text-[#FFF9E8]">{saldoFormateado}</span>
        </p>
      </header>

      <main className="flex-1 px-4 pt-6 pb-4">
        <h2 className="text-lg font-semibold mb-4">Menu</h2>

        <div className="space-y-3">
          <button
            onClick={() => router.push('/delivery/create')}
            className="w-full flex items-center py-3 px-4 rounded-lg bg-[#174A8B] text-[#FFF9E8] shadow-sm hover:brightness-110 transition"
          >
            <div className="w-10 h-10 rounded-full bg-[#FFF9E8] flex items-center justify-center mr-4">
              <span className="text-[#174A8B] text-xs font-extrabold">NEW</span>
            </div>
            <span className="text-base">Historial servicios</span>
          </button> 

          <button
            onClick={() => router.push('/profile-delivery/current-delivery')}
            className="w-full flex items-center py-3 px-4 rounded-lg bg-[#174A8B] text-[#FFF9E8] shadow-sm hover:brightness-110 transition"
          >
            <div className="w-10 h-10 rounded-full bg-[#F5E9C8] flex items-center justify-center mr-4">
              <span className="text-[#174A8B] text-lg">⏱</span>
            </div>
            <span className="text-base">Servicio en curso</span>
          </button>

          <button
            onClick={() => router.push('/wallet')}
            className="w-full flex items-center py-3 px-4 rounded-lg bg-[#174A8B] text-[#FFF9E8] shadow-sm hover:brightness-110 transition"
          >
            <div className="w-10 h-10 rounded-full bg-[#F5E9C8] flex items-center justify-center mr-4">
              <span className="text-[#174A8B] text-lg">👛</span>
            </div>
            <span className="text-base">Cartera</span>
          </button>

          <button
            onClick={() => router.push('/change-password')}
            className="w-full flex items-center py-3 px-4 rounded-lg bg-[#174A8B] text-[#FFF9E8] shadow-sm hover:brightness-110 transition"
          >
            <div className="w-10 h-10 rounded-full bg-[#F5E9C8] flex items-center justify-center mr-4">
              <span className="text-[#174A8B] text-lg">🔒</span>
            </div>
            <span className="text-base">Cambiar Contraseña</span>
          </button>

          <button
            onClick={() => router.push('/withdraw')}
            className="w-full flex items-center py-3 px-4 rounded-lg bg-[#174A8B] text-[#FFF9E8] shadow-sm hover:brightness-110 transition"
          >
            <div className="w-10 h-10 rounded-full bg-[#F5E9C8] flex items-center justify-center mr-4">
              <span className="text-[#174A8B] text-lg">💸</span>
            </div>
            <span className="text-base">Retirar</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center py-3 px-4 rounded-lg bg-[#174A8B] text-[#FFF9E8] shadow-sm hover:brightness-110 transition"
          >
            <div className="w-10 h-10 rounded-full bg-[#F5E9C8] flex items-center justify-center mr-4">
              <span className="text-[#174A8B] text-lg">⏻</span>
            </div>
            <span className="text-base">Cerrar Sesión</span>
          </button>
        </div>
      </main>

      <footer className="bg-[#174A8B] text-[#FFF9E8] py-3 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-[#FFF9E8] flex items-center justify-center">
            <span className="text-[#174A8B] text-lg">👤</span>
          </div>
          <span className="text-sm">{user.nombre}</span>
        </div>
        <span className="text-sm opacity-90">
          {user?.codigo ?? user?.id?.slice(0, 4)}
        </span>
      </footer>

      <NewPedidoNotification />
    </div>
  );
}
