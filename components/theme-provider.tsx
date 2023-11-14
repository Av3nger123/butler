"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import {
	useQuery,
	useMutation,
	useQueryClient,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { ClusterContextProvider } from "./context/cluster-context";

const queryClient = new QueryClient();

export function ThemeProvider({
	children,
	...props
}: Readonly<ThemeProviderProps>) {
	return (
		<NextThemesProvider {...props}>
			<ClusterContextProvider>
				<QueryClientProvider client={queryClient}>
					{children}
				</QueryClientProvider>
			</ClusterContextProvider>
		</NextThemesProvider>
	);
}
