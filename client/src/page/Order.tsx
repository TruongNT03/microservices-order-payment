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
import { useEffect, useState } from "react";
import { getAll, create, cancel } from "@/services/Order";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Order {
  id: number;
  status: string;
  user_id: number;
  product_id: number;
}

const Order = () => {
  const [orders, setOrder] = useState<Array<Order>>([]);
  const [page, setPage] = useState<number>(3);
  const [totalPage, setTotalPage] = useState<number>(1);
  const featchData = async () => {
    const response = await getAll({ page: page, limit: 10 });
    setPage(response?.data.currentPage);
    setTotalPage(response?.data.totalPage);
    setOrder(response?.data.data);
  };
  const handleCancel = async (id: number) => {
    await cancel(id);
    featchData();
  };
  useEffect(() => {
    featchData();
  }, [page]);
  const Uppercase = (str: string): string => {
    return str.substring(0, 1).toUpperCase() + str.substring(1);
  };
  return (
    <div className="w-[800px] m-auto mt-[100px] border-[1px] rounded-xl p-5">
      <div className="my-2 flex justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="default">Create Order</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>TẠO MỚI ORDER</AlertDialogTitle>
              <Label htmlFor="input">Nhập mã PIN để tạo order:</Label>
              <Input id="input"></Input>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  create();
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
              <TableCell>{Uppercase(order.status)}</TableCell>
              <TableCell align="center">
                <Button variant="outline" className="cursor-pointer">
                  Details
                </Button>
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
