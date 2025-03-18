import React from "react";
import { Skeleton } from "./ui/skeleton";

const Loader = () => {
  return (
    <div className="grid grid-cols-15 text-sm font-semibold py-4 mt-3 px-4 text-center">
      <Skeleton className="col-span-3 w-[100px] h-[20px] rounded-full" />
      <Skeleton className="col-span-5 w-[150px] h-[20px] rounded-full" />
      <Skeleton className="col-span-1 w-[20px] h-[20px] rounded-full" />
      <Skeleton className="col-span-2 w-[80px] h-[20px] rounded-full" />
      <Skeleton className="col-span-2 w-[100px] h-[20px] rounded-full" />
      <div className="col-span-2 flex gap-2 items-center justify-center">
        <Skeleton className="w-[20px] h-[20px] rounded-full" />
        <Skeleton className="w-[20px] h-[20px] rounded-full" />
      </div>
    </div>
  );
};

export default Loader;
