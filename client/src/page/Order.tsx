import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Toaster, toast } from "sonner";
import io from "socket.io-client";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GoArrowSwitch } from "react-icons/go";

import { convertDate } from "@/ultis/convertDate";
import { UppercaseFirstLetter } from "@/ultis/UppercaseFisrtLetter";
import {
  getAll,
  create,
  changeStatus,
  getById,
  type OrderEvent,
} from "@/services/Order";
import { useQuery } from "@tanstack/react-query";
import { getNextState } from "@/ultis/OrderStateMachine";
import { Textarea } from "@/components/ui/textarea";

interface Order {
  id: number;
  status: "created" | "confirmed" | "delivered" | "cancelled";
  user_id: number;
  product_id: number;
  created_at: string;
  updated_at: string;
}

const listStatus = {
  all: "All",
  created: "Created",
  confirmed: "Confirmed",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const socket = io("http://127.0.0.1:8080", {
  auth: {
    access_token: localStorage.getItem("access_token"),
  },
});

const Order = () => {
  const navigate = useNavigate();

  // Search Params
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const page = Number.parseInt(searchParams.get("page") || "1");
  const filter = searchParams.get("filter") || "all";
  const orderBy = searchParams.get("orderBy") || "id";
  const sortBy = searchParams.get("sortBy") || "asc";
  // Tanstack
  const { data, refetch } = useQuery({
    queryKey: ["order", { keyword, page, filter, orderBy, sortBy }],
    queryFn: () =>
      getAll({
        page: page,
        limit: 10,
        filter: filter,
        keyword: keyword,
        orderBy: orderBy,
        sortBy: sortBy,
      }),
  });

  const handleSort = (field: string) => {
    setSearchParams((prev) => {
      prev.set("orderBy", field);
      const sortBy = prev.get("sortBy");
      sortBy === "asc" ? prev.set("sortBy", "desc") : prev.set("sortBy", "asc");
      return prev;
    });
  };

  const getDetails = async (id: number) => {
    const response = await getById(id);
    console.log(response);
  };

  useEffect(() => {
    socket.on("connect", () => {});
    socket.on("message", (message) => {
      console.log(message);
      toast("Thông báo", {
        description: message,
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
    });
    socket.on("event", async () => {
      refetch();
    });
  }, []);

  const handleVariant = (status: string) => {
    switch (status) {
      case "created":
        return "outline";
      case "confirmed":
        return "default";
      case "delivered":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "default";
    }
  };
  const handleVariantAction = (action: string) => {
    switch (action) {
      case "payment":
        return "secondary";

      case "confirm":
        return "default";

      case "cancel":
        return "destructive";

      default:
        return "default";
    }
  };
  const handleAction = async (id: number, event: OrderEvent | any) => {
    const response = await changeStatus(id, event);
    refetch();
    toast("Thông báo", {
      description: response.message,
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
  };
  const handleCreate = async () => {
    const response = await create();
    toast("Thông báo", {
      description: response.message,
      duration: 2000,
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
    refetch();
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <div className="w-full">
      <div className="w-full flex justify-end pt-5 pr-5">
        <Button variant="outline" className="" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <div className="w-[800px] m-auto mt-[100px] border-[1px] rounded-xl p-5">
        <Toaster position="top-right" />
        <div className="my-2 flex justify-between">
          <Input
            className="w-[400px]"
            onChange={(e) => {
              setSearchParams((prev) => {
                prev.set("keyword", e.target.value);
                prev.set("page", "1");
                return prev;
              });
            }}
          ></Input>
          <Select
            onValueChange={(value) => {
              setSearchParams((prev) => {
                prev.set("filter", value);
                prev.set("page", "1");
                return prev;
              });
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filler" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                {Object.entries(listStatus).map((value) => (
                  <SelectItem value={value[0]}>{value[1]}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="default">Create Order</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="text-sm">
              <AlertDialogHeader>
                <AlertDialogTitle className="mb-5">
                  TẠO MỚI ORDER
                </AlertDialogTitle>
                <div className="flex items-center gap-5">
                  <div className="flex-[1]">Chọn sản phẩm:</div>
                  <div className="flex-[2]">
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a fruit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Products</SelectLabel>
                          <SelectItem value="apple">Product 1</SelectItem>
                          <SelectItem value="banana">Product 2</SelectItem>
                          <SelectItem value="blueberry">Product 3</SelectItem>
                          <SelectItem value="grapes">Product 4</SelectItem>
                          <SelectItem value="pineapple">Product 5</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="flex-[1]">Số lượng:</div>
                  <div className="flex-[2]">
                    <Input></Input>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="flex-[1]">Ghi chú:</div>
                  <div className="flex-[2]">
                    <Textarea />
                  </div>
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    handleCreate();
                  }}
                >
                  Yes
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-center">
                <Button
                  variant="ghost"
                  className="my-2"
                  onClick={() => {
                    handleSort("id");
                  }}
                >
                  ID
                  <span>
                    <GoArrowSwitch className="rotate-90" />
                  </span>
                </Button>
              </TableHead>
              <TableHead className="w-[150px]">
                <Button
                  variant="ghost"
                  className="my-2"
                  onClick={() => {
                    handleSort("status");
                  }}
                >
                  Status
                  <span>
                    <GoArrowSwitch className="rotate-90" />
                  </span>
                </Button>
              </TableHead>
              <TableHead className="text-center">
                <Button
                  variant="ghost"
                  className="my-2"
                  onClick={() => {
                    handleSort("created_at");
                  }}
                >
                  Created At
                  <span>
                    <GoArrowSwitch className="rotate-90" />
                  </span>
                </Button>
              </TableHead>
              <TableHead className="text-center">
                <Button variant="ghost" className="my-2">
                  Action
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium text-center">
                  {order.id}
                </TableCell>
                <TableCell>
                  <Badge variant={handleVariant(order.status)}>
                    {UppercaseFirstLetter(order.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {convertDate(order.created_at)}
                </TableCell>
                <TableCell align="center">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => {
                          getDetails(order.id);
                        }}
                      >
                        Details
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Chi tiết đơn hàng</AlertDialogTitle>
                        <div className="text-sm flex gap-4">
                          <div className="flex flex-col gap-4 flex-[1]">
                            <div className="flex justify-between">
                              Mã đơn: <span>{order.id}</span>
                            </div>
                            <div className="flex justify-between">
                              Mã SP: <span>{order.product_id}</span>
                            </div>
                            <div className="flex justify-between">
                              Trạng thái:{" "}
                              <Badge variant={handleVariant(order.status)}>
                                {UppercaseFirstLetter(order.status)}
                              </Badge>
                            </div>
                          </div>
                          <img
                            className="max-w-[250px] rounded-xl flex-[1]"
                            src="https://cdn.dealeraccelerate.com/noreserve/1/591/20046/1920x1440/1969-ford-mustang"
                            alt=""
                          />
                        </div>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>OK</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  {getNextState(order.status)?.map((value, index) => (
                    <Button
                      key={index}
                      onClick={() => {
                        handleAction(order.id, value.event);
                      }}
                      variant={handleVariantAction(value.event)}
                      className={`cursor-pointer ml-5`}
                    >
                      {UppercaseFirstLetter(value.event)}
                    </Button>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="">
          <Pagination className="justify-end">
            <PaginationContent>
              <PaginationItem
                onClick={() => {
                  setSearchParams((prev) => {
                    const page = Number.parseInt(prev.get("page") || "1");
                    if (page != 1) {
                      prev.set("page", (page - 1).toString());
                    }
                    return prev;
                  });
                }}
              >
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem
                onClick={() => {
                  setSearchParams((prev) => {
                    prev.set("page", "1");
                    return prev;
                  });
                }}
              >
                <PaginationLink href="#" isActive={page === 1}>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={() => {
                    setSearchParams((prev) => {
                      prev.set("page", (page - 1).toString());
                      return prev;
                    });
                  }}
                  href="#"
                  className={`${page > 2 ? "" : "hidden"}`}
                >
                  {page - 1}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem
                className={`${
                  page !== 1 && page !== data?.totalPage ? "" : "hidden"
                } `}
              >
                <PaginationLink href="#" isActive>
                  {page}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={() => {
                    setSearchParams((prev) => {
                      prev.set("page", (page + 1).toString());
                      return prev;
                    });
                  }}
                  href="#"
                  className={`${
                    data && page < data.totalPage - 1 ? "" : "hidden"
                  }`}
                >
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem
                onClick={() => {
                  setSearchParams((prev) => {
                    data && prev.set("page", data.totalPage.toString());
                    return prev;
                  });
                }}
              >
                <PaginationLink
                  href="#"
                  isActive={page === data?.totalPage}
                  className={`${data && data.totalPage > 1 ? "" : "hidden"}`}
                >
                  {data?.totalPage}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem
                onClick={() => {
                  if (data && page < data.totalPage) {
                    setSearchParams((prev) => {
                      const page = Number.parseInt(prev.get("page") || "1");
                      if (page < data.totalPage) {
                        prev.set("page", (page + 1).toString());
                      }
                      return prev;
                    });
                  }
                }}
              >
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default Order;
