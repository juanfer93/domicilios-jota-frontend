"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDeliveryStore } from "@/store/useDeliveryStore";
import { useAuthStore } from "@/store/UseAuthStore";
import type { PedidoEstado } from "@/lib/api"; 

export function DeliveryClient({ adminName }: { adminName: string }) {
	const router = useRouter();
	const { token } = useAuthStore();

	const { pedidosHoy,
		statusToday,
		error,
		clearError,
		loadPedidosHoy,
		changeEstado,
		setTab
	} = useDeliveryStore();

        useEffect(() => {
                setTab("today");
                loadPedidosHoy();
        }, [loadPedidosHoy, setTab, token]);

	const pedidosPorDomiciliario = useMemo(() => {
		const map = new Map<string, typeof pedidosHoy>();
		for (const p of pedidosHoy) {
			const key = p.usuario?.nombre ?? p.usuario_id ?? "Sin domiciliario";
			if (!map.has(key)) map.set(key, []);
			map.get(key)!.push(p);
		}
		return Array.from(map.entries());
	}, [pedidosHoy]);

	return (
		<div className="min-h-screen bg-[#FFF9E8]">
			<div className="mx-auto w-full max-w-6xl px-4 py-6">
				<div className="flex flex-wrap items-center gap-2">
					<h1 className="mr-auto text-2xl font-extrabold text-[#030303ff]">
						Delivery · <span className="text-[#174A8B]">{adminName}</span>
					</h1>

					<button
						onClick={() => router.push("/delivery/create")}
						className="rounded-xl bg-[#174A8B] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
					>
						Crear nuevo pedido
					</button>

					<button
						onClick={() => router.push("/delivery/history")}
						className="rounded-xl border border-[#174A8B] bg-white px-4 py-2 text-sm font-semibold text-[#174A8B] hover:bg-[#F5E9C8]"
					>
						Historial
					</button>

					<button
						onClick={() => router.push("/dashboard")}
						className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[#030303ff] hover:bg-black/5"
					>
						Cerrar
					</button>
				</div>

				{error && (
					<div className="mt-4 rounded-xl border border-red-200 bg-white p-3 text-sm text-[#030303ff]">
						<div className="flex items-center gap-3">
							<div className="font-semibold text-red-600">Error</div>
							<div className="flex-1">{error}</div>
							<button
								onClick={clearError}
								className="rounded-lg bg-[#F5E9C8] px-3 py-1 text-xs font-semibold text-[#030303ff] hover:opacity-95"
							>
								OK
							</button>
						</div>
					</div>
				)}

				<div className="mt-5">
					{statusToday === "loading" ? (
						<div className="rounded-2xl border border-black/10 bg-white p-6 text-[#030303ff]">
							Cargando...
						</div>
					) : pedidosHoy.length === 0 ? (
						<div className="rounded-2xl border border-black/10 bg-white p-6 text-[#030303ff]">
							No hay pedidos hoy.
						</div>
					) : (
						<div className="space-y-4">
							{pedidosPorDomiciliario.map(([dom, items]) => (
								<div key={dom} className="rounded-2xl border border-black/10 bg-white p-4">
									<div className="mb-3 flex items-center justify-between gap-2">
										<h2 className="text-base font-extrabold text-[#030303ff]">{dom}</h2>
										<span className="rounded-full bg-[#F5E9C8] px-3 py-1 text-xs font-bold text-[#030303ff]">
											{items.length} pedido(s)
										</span>
									</div>

									<div className="space-y-3">
										{items.map((p) => (
											<div
												key={p.id}
												className="rounded-2xl border border-black/10 bg-[#FFF9E8] p-4"
											>
												<div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#030303ff]">
													<span className="font-extrabold text-[#174A8B]">
														{p.comercio?.nombre ?? p.comercio_id}
													</span>
													<span className="opacity-60">·</span>
													<span>
														Valor:{" "}
														<span className="font-extrabold">
															{Number(p.valor_final ?? 0).toLocaleString()}
														</span>
													</span>
													<span className="opacity-60">·</span>
													<span>
														Estado: <span className="font-extrabold">{p.estado}</span>
													</span>
												</div>

												{p.comercio?.direccion && (
													<div className="mt-2 text-sm text-[#030303ff]/80">
														Dirección: {p.comercio.direccion}
													</div>
												)}

												<div className="mt-3 flex flex-wrap items-center gap-2">
													<span className="text-sm font-bold text-[#030303ff]">
														Cambiar estado:
													</span>
													<select
														value={p.estado}
														onChange={(e) => changeEstado(p.id, e.target.value as PedidoEstado)}
														className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[#030303ff] focus:outline-none focus:ring-2 focus:ring-[#174A8B]/30"
													>
														<option value="EN_PROCESO">En proceso</option>
														<option value="HECHO">Hecho</option>
														<option value="CANCELADO">Cancelado</option>
													</select>
												</div>
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
