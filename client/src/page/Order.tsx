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
import { Label } from "@/components/ui/label";
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

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { Toaster, toast } from "sonner";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { GoArrowSwitch } from "react-icons/go";

import { convertDate } from "@/ultis/convertDate";
import { UppercaseFirstLetter } from "@/ultis/UppercaseFisrtLetter";
import { getAll, create, cancel, getById } from "@/services/Order";
import { useQuery } from "@tanstack/react-query";

interface Order {
  id: number;
  status: string;
  user_id: number;
  product_id: number;
  createdAt: string;
  updatedAt: string;
}

const listStatus = {
  all: "All",
  created: "Created",
  confirmed: "Confirmed",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const socket = io("http://127.0.0.1:8080", {});

const Order = () => {
  // Search Params
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const page = Number.parseInt(searchParams.get("page") || "1");
  const filter = searchParams.get("filter") || "all";
  const orderBy = searchParams.get("orderBy") || "id";
  const sortBy = searchParams.get("sortBy") || "asc";
  // States
  const [PIN, setPIN] = useState<string>("");
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
        break;
      case "confirmed":
        return "default";
        break;
      case "delivered":
        return "secondary";
        break;
      case "cancelled":
        return "destructive";
        break;
      default:
        return "default";
        break;
    }
  };
  const handleCancel = async (id: number) => {
    await cancel(id);
    refetch();
    toast("Thông báo", {
      description: "Hủy đơn hàng thành công!",
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
  };
  const handleCreate = async () => {
    await create(PIN);
    refetch();
  };

  return (
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
        <AlertDialog
          onOpenChange={(open) => {
            !open && setPIN("");
          }}
        >
          <AlertDialogTrigger asChild>
            <Button variant="default">Create Order</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>TẠO MỚI ORDER</AlertDialogTitle>
              <div className="mx-auto">
                <Label htmlFor="input" className="mb-4">
                  Nhập mã PIN để tạo order:
                </Label>
                <InputOTP
                  maxLength={4}
                  id="input"
                  value={PIN}
                  onChange={(value) => setPIN(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="text-center text-sm">
                {PIN === "" ? (
                  <>Enter your one-time password.</>
                ) : (
                  <>You entered: {PIN}</>
                )}
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
                  handleSort("createdAt");
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
                {convertDate(order.createdAt)}
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
                <Button
                  onClick={() => {
                    handleCancel(order.id);
                  }}
                  variant="destructive"
                  className={`cursor-pointer ml-5 ${
                    order.status === "cancelled" ? "invisible" : ""
                  }`}
                >
                  Cancel
                </Button>
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
  );
};

export default Order;
