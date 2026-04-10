import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

export function useCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch("http://localhost:5003/api/vehicles/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Check-in failed");

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slots"] });
    },
  });
}



export function useCheckOut() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch("http://localhost:5003/api/vehicles/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicle_id: data.vehicle_id,
        }),
      });

      if (!res.ok) throw new Error("Check-out failed");

      return res.json();
    },

    onSuccess: () => {
      toast({
        title: "Check-out Successful",
        description: "Payment processed",
      });

      queryClient.invalidateQueries({ queryKey: ["slots"] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["active-vehicles"] });
    },

    onError: (error) => {
      toast({
        title: "Check-out Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5003/api/payments");

      if (!res.ok) throw new Error("Failed to fetch payments");

      return res.json();
    },
  });
}