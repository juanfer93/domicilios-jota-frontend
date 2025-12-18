import { getAuthHeaders } from "./GetAuthHeaders";
import axios from "axios";
import { extractPayload } from "./apiUtils";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
});

export type PedidoEstado = "EN_PROCESO" | "HECHO" | "CANCELADO";

export interface AdminStatus {
  hasAdmin: boolean;
  adminName?: string | null
}

export interface CreateAdminPayload {
  nombre: string;
  email: string;
  password: string;
}

export interface DashboardSummary {
  totalPedidos: number;
  totalDomiciliarios: number;
  totalComercios: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  usuario: {
    id: string;
    nombre: string;
    email: string;
    rol: 'ADMIN' | 'DOMICILIARIO';
  };
}

export interface CreateDomiciliarioPayload {
  nombre: string;
  email: string;
}

export interface CreateDomiciliarioResponse {
  id: string;
  nombre: string;
  email: string;
  rol: string;
}

export interface DomiciliarioItem {
  id: string;
  nombre: string;
  email: string;
}

export interface ComercioItem {
  id: string;
  nombre: string;
  direccion: string;
}

export interface ComercioPayload {
  nombre: string;
  direccion: string;
}

export interface SetPasswordDomiciliarioPayload {
  token: string;
  password: string;
}

export interface SetPasswordDomiciliarioResponse {
  message: string;
}

export interface PedidoItem {
  id: string;
  usuario_id: string;
  comercio_id: string;
  valor_final: number;
  valor_domicilio?: number | null;
  estado: PedidoEstado;
  created_at: string;
  assigned_by?: string | null;
  assigned_at?: string | null;
  direccionDestino: string;

  usuario?: {
    id: string;
    nombre: string;
    email: string;
  };

  comercio?: {
    id: string;
    nombre: string;
    direccion: string;
  };
}

export interface CurrentDeliveryItem {
  id: string;
  valorFinal: number;
  valorDomicilio: number;
  direccionDestino: string;
  comercio?: {
    id: string;
    nombre: string;
    direccion: string;
  };
}

export interface CreatePedidoPayload {
  usuarioId: string;  
  comercioId: string;
  valorFinal: number;
  valorDomicilio?: number;
  direccionDestino: string;
}

export interface UpdatePedidoEstadoPayload {
  estado: PedidoEstado;
}

export const getAdminStatus = async (): Promise<AdminStatus> => {
  const { data } = await api.get<AdminStatus>("/api/v1/users/admin-status");
  return data;
};

export const createAdmin = async (payload: CreateAdminPayload) => {
  const body = {
    ...payload,
    rol: "admin", 
  };

  const { data } = await api.post("/api/v1/users/admin", body);
  return data;
};

export const login = async (payload: LoginPayload) => {
  const { data } = await api.post("/api/v1/auth/login", payload);

  const payloadData = extractPayload<LoginResponse>(data);

  return payloadData;
}

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const { data } = await api.get<DashboardSummary>(
    "/api/v1/users/dashboard-summary"
  );
  const payloadData = extractPayload<DashboardSummary>(data);

  return payloadData;
}

export const createDomiciliario = async (
  payload: CreateDomiciliarioPayload
): Promise<CreateDomiciliarioResponse> => {
  const { data } = await api.post(
    "/api/v1/usuarios/domiciliarios",
    payload,
    {
      headers: {
        ...getAuthHeaders(),
      },
    }
  );

  const payloadData = extractPayload<CreateDomiciliarioResponse>(data);

  return payloadData;
};

export const setPasswordDomiciliario = async (
  payload: SetPasswordDomiciliarioPayload
): Promise<SetPasswordDomiciliarioResponse> => {
  const { data } = await api.post(
    "/api/v1/auth/domiciliarios/set-password",
    payload
  );

  const payloadData = extractPayload<SetPasswordDomiciliarioResponse>(data);

  return payloadData;
};

export const getDomiciliarios = async (): Promise<DomiciliarioItem[]> => {
  const { data } = await api.get("/api/v1/usuarios/domiciliarios", {
    headers: {
      ...getAuthHeaders(),
    },
  });

  const payloadData = extractPayload<DomiciliarioItem[]>(data);

  return payloadData;
};

export const deleteDomiciliario = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/usuarios/domiciliarios/${id}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
};

export const getComercios = async () => {
  const res = await api.get("/api/v1/comercios", {
    headers: getAuthHeaders(),
  });

  const payloadData = extractPayload<ComercioItem[]>(res.data);
  return payloadData;
}

export const createComercios = async (data: ComercioPayload) => {
  const res = await api.post("/api/v1/comercios", data, {
    headers: getAuthHeaders(),
  });

  const payloadData = extractPayload<ComercioItem>(res.data);
  return payloadData;
}

export const deleteComercios = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/comercios/${id}`, {
    headers: getAuthHeaders(),
  })
}

export const getPedidosHoy = async (): Promise<PedidoItem[]> => {
  const res = await api.get("/api/v1/pedidos/admin/today", {
    headers: {
      ...getAuthHeaders(),
    },
  });

  const payloadData = extractPayload<PedidoItem[]>(res.data);
  return payloadData;
};

export const getPedidosHistorial = async (date: string): Promise<PedidoItem[]> => {
  const res = await api.get("/api/v1/pedidos/admin/history", {
    params: { date },
    headers: {
      ...getAuthHeaders(),
    },
  });

  const payloadData = extractPayload<PedidoItem[]>(res.data);
  return payloadData;
};

export const createPedido = async (
  payload: CreatePedidoPayload
): Promise<PedidoItem> => {
  const res = await api.post("/api/v1/pedidos/admin", payload, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  const payloadData = extractPayload<PedidoItem>(res.data);
  return payloadData;
};

export const updatePedidoEstado = async (
  pedidoId: string,
  payload: UpdatePedidoEstadoPayload
): Promise<PedidoItem> => {
  const res = await api.patch(`/api/v1/pedidos/admin/${pedidoId}/estado`, payload, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  const payloadData = extractPayload<PedidoItem>(res.data);
  return payloadData;
};

export const getCurrentDelivery = async (): Promise<CurrentDeliveryItem | null> => {
  const res = await api.get("/api/v1/pedidos/admin/domiciliarios/current", {
    headers: {
      ...getAuthHeaders(),
    },
  });

  const payloadData = extractPayload<CurrentDeliveryItem | null>(res.data);

  if (!payloadData) return null;

  return payloadData;
};


