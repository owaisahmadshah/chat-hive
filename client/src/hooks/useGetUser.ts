import { userServ } from "@/services/global-services";
import { useQuery } from "@tanstack/react-query";

export const useGetUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: userServ,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};
