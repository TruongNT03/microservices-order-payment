import { Button } from "@/components/ui/button";
import io from "socket.io-client";
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
import { useEffect, useState } from "react";
import { getAll, create, cancel } from "@/services/Order";
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
import { toast } from "sonner";

interface Order {
  id: number;
  status: string;
  user_id: number;
  product_id: number;
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
  const [orders, setOrder] = useState<Array<Order>>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [filter, setFiller] = useState<string>("all");
  const [keyword, setKeyword] = useState<string>("");
  const [PIN, setPIN] = useState<string>("");
  const featchData = async () => {
    const response = await getAll({
      page: page,
      limit: 10,
      filter: filter,
      keyword: keyword,
    });
    setPage(response?.data.currentPage);
    setTotalPage(response?.data.totalPage);
    setOrder(response?.data.data);
  };
  useEffect(() => {
    socket.on("connect", () => {});
    socket.on("event", () => {
      featchData();
      toast("Event has been created", {
        description: "Đơn hàng đã được vận chuyển!",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
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
    featchData();
  };
  const handleCreate = async () => {
    await create(PIN);
    featchData();
  };
  useEffect(() => {
    featchData();
  }, [page, filter, keyword]);
  const Uppercase = (str: string): string => {
    return str.substring(0, 1).toUpperCase() + str.substring(1);
  };
  return (
    <div className="w-[800px] m-auto mt-[100px] border-[1px] rounded-xl p-5">
      <div className="my-2 flex justify-between">
        <Input
          className="w-[400px]"
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
        ></Input>
        <Select
          onValueChange={(value) => {
            setFiller(value);
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
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>TẠO MỚI ORDER</AlertDialogTitle>
              <Label htmlFor="input">Nhập mã PIN để tạo order:</Label>
              <Input
                onChange={(e) => setPIN(e.target.value)}
                id="input"
              ></Input>
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
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>
                <Badge variant={handleVariant(order.status)}>
                  {Uppercase(order.status)}
                </Badge>
              </TableCell>
              <TableCell align="center">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">Details</Button>
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
                              {Uppercase(order.status)}
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
                {/* <Button variant="outline" className="cursor-pointer">
                  Details
                </Button> */}
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
                if (page != 1) {
                  setPage((prev) => prev - 1);
                }
              }}
            >
              <PaginationPrevious href="#" />
            </PaginationItem>

            <PaginationItem onClick={() => setPage(1)}>
              <PaginationLink href="#" isActive={page === 1}>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                onClick={() => setPage((prev) => prev - 1)}
                href="#"
                className={`${page > 2 ? "" : "hidden"}`}
              >
                {page - 1}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem
              className={`${page !== 1 && page !== totalPage ? "" : "hidden"} `}
            >
              <PaginationLink href="#" isActive>
                {page}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                onClick={() => setPage((prev) => prev + 1)}
                href="#"
                className={`${page < totalPage - 1 ? "" : "hidden"}`}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem onClick={() => setPage(totalPage)}>
              <PaginationLink href="#" isActive={page === totalPage}>
                {totalPage}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem
              onClick={() => {
                if (page < totalPage) {
                  setPage((prev) => prev + 1);
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
