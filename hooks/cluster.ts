import { getApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useGetClusters = (workspace: any) => {
	return useQuery({
		queryKey: ["clusters", workspace?.id],
		queryFn: async () => {
			return await getApi(`/api/clusters?workspaceId=${workspace?.id}`);
		},
		enabled: !!workspace?.id,
	});
};
