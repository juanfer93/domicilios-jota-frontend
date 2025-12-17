import { create } from "zustand";
import {
  getPedidosHoy,
  getPedidosHistorial,
  createPedido,
  updatePedidoEstado,
  getDomiciliarios,
  getComercios,
  type PedidoItem,
  type PedidoEstado,
  type DomiciliarioItem,
  type ComercioItem,
} from "@/lib/api";
import { sendNewPedidoNotification } from "@/lib/notifications";

type DeliveryTab = "today" | "history" | "create";
type Status = "idle" | "loading" | "success" | "error";

interface DeliveryState {
  tab: DeliveryTab;
  setTab: (tab: DeliveryTab) => void;

  direccionDestino: string;
  setDireccionDestino: (v: string) => void;

  pedidosHoy: PedidoItem[];
  pedidosHistorial: PedidoItem[];
  historyDate: string;
  setHistoryDate: (date: string) => void;

  domiciliarios: DomiciliarioItem[];
  comercios: ComercioItem[];

  selectedDomiciliarioId: string | null;
  selectedComercioId: string | null;
  valorFinal: string;
  valorDomicilio: string;
  modalOpen: boolean;

  selectDomiciliario: (id: string | null) => void;
  selectComercio: (id: string | null) => void;
  setValorFinal: (v: string) => void;
  setValorDomicilio: (v: string) => void;
  setModalOpen: (open: boolean) => void;
  resetCreate: () => void;

  statusToday: Status;
  statusHistory: Status;
  statusCreate: Status;
  statusRefs: Status;
  error: string | null;
  clearError: () => void;

  loadPedidosHoy: () => Promise<void>;
  loadPedidosHistorial: (date?: string) => Promise<void>;
  loadRefs: () => Promise<void>;
  assignPedido: () => Promise<PedidoItem | null>;
  changeEstado: (pedidoId: string, estado: PedidoEstado) => Promise<void>;
}

const todayISO = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const useDeliveryStore = create<DeliveryState>((set, get) => ({
  tab: "today" as DeliveryTab,
  setTab: (tab) => set({ tab }),

  direccionDestino: "",
  setDireccionDestino: (v) => set({ direccionDestino: v }),

  pedidosHoy: [],
  pedidosHistorial: [],
  historyDate: todayISO(),
  setHistoryDate: (date) => set({ historyDate: date }),

  domiciliarios: [],
  comercios: [],

  selectedDomiciliarioId: null,
  selectedComercioId: null,
  valorFinal: "",
  valorDomicilio: "",
  modalOpen: false,

  selectDomiciliario: (id) => {
    set({ selectedDomiciliarioId: id });
    const { selectedComercioId } = get();
    if (id && selectedComercioId) set({ modalOpen: true });
  },
  selectComercio: (id) => {
    set({ selectedComercioId: id });
    const { selectedDomiciliarioId } = get();
    if (id && selectedDomiciliarioId) set({ modalOpen: true });
  },

  setValorFinal: (v) => set({ valorFinal: v }),
  setValorDomicilio: (v) => set({ valorDomicilio: v }),
  setModalOpen: (open) => set({ modalOpen: open }),

  resetCreate: () =>
    set({
      selectedDomiciliarioId: null,
      selectedComercioId: null,
      valorFinal: "",
      valorDomicilio: "",
      direccionDestino: "",
      modalOpen: false,
      statusCreate: "idle" as Status,
      error: null,
    }),

  statusToday: "idle" as Status,
  statusHistory: "idle" as Status,
  statusCreate: "idle" as Status,
  statusRefs: "idle" as Status,
  error: null,
  clearError: () => set({ error: null }),

  loadPedidosHoy: async () => {
    set({ statusToday: "loading" as Status, error: null });
    try {
      const data = await getPedidosHoy();
      set({ pedidosHoy: data, statusToday: "success" as Status });
    } catch (e: any) {
      set({
        statusToday: "error" as Status,
        error: e?.message ?? "Error cargando pedidos de hoy",
      });
    }
  },

  loadPedidosHistorial: async (date) => {
    const d = date ?? get().historyDate;
    set({ statusHistory: "loading" as Status, error: null });
    try {
      const data = await getPedidosHistorial(d);
      set({
        pedidosHistorial: data,
        statusHistory: "success" as Status,
        historyDate: d,
      });
    } catch (e: any) {
      set({
        statusHistory: "error" as Status,
        error: e?.message ?? "Error cargando historial",
      });
    }
  },

  loadRefs: async () => {
    set({ statusRefs: "loading" as Status, error: null });
    try {
      const [doms, coms] = await Promise.all([
        getDomiciliarios(),
        getComercios(),
      ]);
      set({
        domiciliarios: doms,
        comercios: coms,
        statusRefs: "success" as Status,
      });
    } catch (e: any) {
      set({
        statusRefs: "error" as Status,
        error: e?.message ?? "Error cargando domiciliarios/comercios",
      });
    }
  },

  assignPedido: async () => {
    const {
      selectedDomiciliarioId,
      selectedComercioId,
      valorFinal,
      valorDomicilio,
      direccionDestino,
    } = get();

    if (!selectedDomiciliarioId || !selectedComercioId) {
      set({ error: "Debes seleccionar 1 domiciliario y 1 comercio." });
      return null;
    }

    if (!direccionDestino.trim()) {
      set({ error: "Ingresa la dirección destino." });
      return null;
    }

    const vf = Number(valorFinal);
    if (!Number.isFinite(vf) || vf <= 0) {
      set({ error: "Ingresa un valor del pedido válido." });
      return null;
    }

    const vd = valorDomicilio.trim() ? Number(valorDomicilio) : undefined;
    if (
      valorDomicilio.trim() &&
      (!Number.isFinite(vd) || (vd as number) < 0)
    ) {
      set({ error: "El valor domicilio no es válido." });
      return null;
    }

    set({ statusCreate: "loading" as Status, error: null });
    try {
      const pedido = await createPedido({
        usuarioId: selectedDomiciliarioId,
        comercioId: selectedComercioId,
        valorFinal: vf,
        ...(vd !== undefined ? { valorDomicilio: vd } : {}),
        direccionDestino,
      });

      set({ statusCreate: "success" as Status });
      setTimeout(() => {
        sendNewPedidoNotification(selectedDomiciliarioId, pedido.id);
      }, 3000);
      await get().loadPedidosHoy();
      get().resetCreate();
      return pedido;
    } catch (e: any) {
      set({
        statusCreate: "error" as Status,
        error: e?.message ?? "Error asignando pedido",
      });
      return null;
    }
  },

  changeEstado: async (pedidoId, estado) => {
    set({ error: null });
    try {
      await updatePedidoEstado(pedidoId, { estado });

      await get().loadPedidosHoy();

      const { tab, historyDate } = get();
      if (tab === "history") {
        await get().loadPedidosHistorial(historyDate);
      }
    } catch (e: any) {
      set({ error: e?.message ?? "Error cambiando estado" });
    }
  },
}));
