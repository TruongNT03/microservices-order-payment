import instance from "@/axios/axios";

interface queryOftion {
  limit: number;
  page: number;
}

const getAll = async (queryOftion: queryOftion) => {
  try {
    const response = await instance.get("/order", {
      params: queryOftion,
    });
    return response;
  } catch (error) {
    Promise.reject(error);
  }
};

const create = async () => {
  try {
    const response = await instance.post("order", {
      user_id: 1,
      product_id: 1,
    });
    return response;
  } catch (error) {
    Promise.reject(error);
  }
};

const cancel = async (id: number) => {
  try {
    const response = await instance.put(`order/cancel/${id}`);
    return response;
  } catch (error) {
    Promise.reject(error);
  }
};

export { getAll, create, cancel };
