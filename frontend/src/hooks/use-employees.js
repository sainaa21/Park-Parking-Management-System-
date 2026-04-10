import { useQuery } from "@tanstack/react-query";

export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5003/api/employees");

      if (!res.ok) throw new Error("Failed");

      return res.json();
    },
  });
}
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch("http://localhost:5003/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          role: data.role,
          shift_time: data.shiftTime, // ✅ IMPORTANT
          password: data.password,
        }),
      });

      if (!res.ok) throw new Error("Failed to create employee");

      return res.json();
    },

    onSuccess: () => {
      // 🔁 refresh employee list
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}