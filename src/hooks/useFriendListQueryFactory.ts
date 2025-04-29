import { useInfiniteQuery } from "@tanstack/react-query";
import { instance } from "../apis";

interface UseFriendListQueryOptions {
    queryKey: string[];
    endpoint: string;
    name: string;
  }
  
  export const useFriendListQuery = ({ queryKey, endpoint, name }: UseFriendListQueryOptions) => {
    return useInfiniteQuery({
      queryKey,
      queryFn: async ({ pageParam = 0 }) => {
        const { data } = await instance.get(`${endpoint}?page=${pageParam}&name=${encodeURIComponent(name)}`)
        return { ...data, page: pageParam }
      },
      getNextPageParam: (lastPage, allPages) => {
        const totalFetched = allPages.reduce((acc, page) => acc + page.users.length, 0)
        const totalAvailable = lastPage.usersCnt
        
        return totalFetched < totalAvailable ? lastPage.page + 1 : undefined
      },
      staleTime: 1000 * 60,
      initialPageParam: 0
    });
  };
  