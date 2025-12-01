"use client";

type Props = {
  adminName: string;
};

export function WelcomeClient({ adminName }: Props) {
  return (
    <div className="min-h-screen bg-[#174A8B] text-[#F5E9C8] flex items-center justify-center">
      <div className="rounded-3xl border border-[#F5E9C8]/40 bg-[#102F59] px-10 py-8 shadow-2xl text-center max-w-lg">
        <h1 className="text-3xl font-semibold mb-3">
          Bienvenido, {adminName} 👋
        </h1>
        <p className="text-sm text-[#F5E9C8]/90">
          Este será el panel principal de administración de Jota Jota Delivery.
        </p>
      </div>
    </div>
  );
}
