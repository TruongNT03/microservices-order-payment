import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

const shoes = [
  {
    product_id: 1,
    name: "Nike Dunk High",
    img: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/99486859-0ff3-46b4-949b-2d16af2ad421/custom-nike-dunk-high-by-you-shoes.png",
  },
  {
    product_id: 2,
    name: "Nike Interact Run EasyOn",
    img: "https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/AIR+FORCE+1+%2707.png",
  },
  {
    product_id: 3,
    name: "Nike Air Force 1",
    img: "https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/AIR+FORCE+1+%2707.png",
  },
  {
    product_id: 4,
    name: "Nike Air Max INTRLK Lite",
    img: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/20547d52-3e1b-4c3d-b917-f0d7e0eb8bdf/custom-nike-air-force-1-low-by-you-shoes.png",
  },
  {
    product_id: 5,
    name: "Nike Air Force 1 Low",
    img: "https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/e783e052-9360-4afb-adb8-c4e9c0f5db07/NIKE+AIR+MAX+NUAXIS.png",
  },
  {
    product_id: 6,
    name: "Nike Dunk High",
    img: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/99486859-0ff3-46b4-949b-2d16af2ad421/custom-nike-dunk-high-by-you-shoes.png",
  },
  {
    product_id: 7,
    name: "Nike Interact Run EasyOn",
    img: "https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/AIR+FORCE+1+%2707.png",
  },
  {
    product_id: 8,
    name: "Nike Air Force 1",
    img: "https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/AIR+FORCE+1+%2707.png",
  },
  {
    product_id: 9,
    name: "Nike Air Max INTRLK Lite",
    img: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/20547d52-3e1b-4c3d-b917-f0d7e0eb8bdf/custom-nike-air-force-1-low-by-you-shoes.png",
  },
  {
    product_id: 10,
    name: "Nike Air Force 1 Low",
    img: "https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/e783e052-9360-4afb-adb8-c4e9c0f5db07/NIKE+AIR+MAX+NUAXIS.png",
  },
];

const Home = () => {
  return (
    <div className="w-[80%] text-black flex flex-wrap gap-10 m-auto mt-[100px]">
      {shoes.map((value, index) => (
        <Card className="bg-[#f5f5f5]" key={index}>
          <CardHeader>
            <CardTitle>{value.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={value.img}
              alt=""
              className="max-w-[200px] max-h-[300px] object-cover"
            />
          </CardContent>
          <CardFooter>
            <Button variant="secondary" className="bg-blue-200">
              Order
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Home;
