import instance from "@/axios/axios";

interface queryOftion {
  limit: number;
  page: number;
  filter: string;
  keyword: string;
  orderBy: string;
  sortBy: string;
}

interface order {
  id: number;
  user_id: number;
  product_id: number;
  status: "created" | "confirmed" | "delivered" | "cancelled";
  created_at: string;
  updated_at: string;
}

interface getAllRes {
  data: order[];
  currentPage: number;
  totalPage: number;
  limit: number;
}

const getAll = async (queryOftion: queryOftion): Promise<getAllRes> => {
  try {
    const response = await instance.get("/order", {
      params: queryOftion,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const create = async () => {
  try {
    const response = await instance.post("order", {
      product_id: Math.ceil(Math.random() * 100),
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export interface OrderEvent {
  event: "confirm" | "cancel" | "payment";
}

const changeStatus = async (id: number, event: Event) => {
  try {
    const response = await instance.patch(`order/${id}`, { event: event });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const getById = async (id: number) => {
  try {
    const response = await instance.get(`order/${id}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export { getAll, create, changeStatus, getById };
