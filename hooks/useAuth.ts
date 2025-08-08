import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import { LoginRequest, User } from "@/types/auth";
import { useAuthStore } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function useLogin() {
  const { setUser, setToken } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => AuthService.login(credentials),
    onSuccess: (data) => {
      setUser(data.user);
      setToken(data.token);

      toast({
        title: "Success",
        description: "Logged in successfully",
      });

      // Redirect based on role
      if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/employee");
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Login failed",
        variant: "destructive",
      });
    },
  });
}

export function useLogout() {
  const { clearAuth, logout: storeLogout } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    // Mock logout: clear local state and tokens without hitting API
    mutationFn: async () => {
      await Promise.resolve(storeLogout());
    },
    onSuccess: () => {
      // Ensure all cached queries are cleared
      clearAuth();
      queryClient.clear();
      router.push("/auth/signin");

      toast({
        title: "Success",
        description: "Logged out successfully",
      });
    },
    onError: () => {
      // Fallback to local clear even if something goes wrong
      clearAuth();
      queryClient.clear();
      router.push("/auth/signin");
    },
  });
}

export function useCurrentUser() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ["current-user"],
    queryFn: () => AuthService.getCurrentUser(),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useChangePassword() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: {
      current_password: string;
      new_password: string;
      confirm_password: string;
    }) => AuthService.changePassword(data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Password changed successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to change password",
        variant: "destructive",
      });
    },
  });
}
