import { useQuery } from "@tanstack/react-query";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5003/api/dashboard/stats");

      if (!res.ok) throw new Error("Failed");

      return res.json();
    },
  });
}