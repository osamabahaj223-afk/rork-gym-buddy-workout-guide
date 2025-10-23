import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  }

  console.warn(
    "No base url found for tRPC. Backend features will not work. Please set EXPO_PUBLIC_RORK_API_BASE_URL in your environment."
  );
  return "http://localhost:3000";
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      fetch: async (input, init) => {
        try {
          const response = await fetch(input, init);
          
          if (!response.ok) {
            console.error(`tRPC request failed with status ${response.status}`);
          }
          
          const contentType = response.headers.get("content-type");
          if (contentType && !contentType.includes("application/json")) {
            console.error(
              `tRPC received non-JSON response. Content-Type: ${contentType}`
            );
            throw new Error(
              "Backend returned invalid response. Please check if the backend is running."
            );
          }
          
          return response;
        } catch (error) {
          console.error("tRPC fetch error:", error);
          throw error;
        }
      },
    }),
  ],
});
