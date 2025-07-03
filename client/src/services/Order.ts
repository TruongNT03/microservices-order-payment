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
  status: string;
  createdAt: string;
  updatedAt: string;
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

const create = async (PIN: string) => {
  try {
    const response = await instance.post("order", {
      user_id: 1,
      product_id: 1,
      PIN: PIN,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const cancel = async (id: number) => {
  try {
    const response = await instance.put(`order/cancel/${id}`);
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

export { getAll, create, cancel, getById };
