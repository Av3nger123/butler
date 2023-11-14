import { Database } from "@/types";
import { createContext, useState, useContext, ReactNode, useMemo } from "react";

interface ClusterContextType {
	myState: Database;
	setMyState: React.Dispatch<React.SetStateAction<Database>>;
}

const ClusterContext = createContext<ClusterContextType | undefined>(undefined);

interface ClusterContextProviderProps {
	children: ReactNode;
}

export const ClusterContextProvider: React.FC<ClusterContextProviderProps> = ({
	children,
}) => {
	const [myState, setMyState] = useState<Database>({
		id: "",
		name: "",
		host: "",
		port: "",
		type: "",
		username: "",
		password: "",
	});

	const contextValue: ClusterContextType = useMemo(() => {
		return {
			myState,
			setMyState,
		};
	}, [myState, setMyState]);
	return (
		<ClusterContext.Provider value={contextValue}>
			{children}
		</ClusterContext.Provider>
	);
};

export const useClusterContext = (): ClusterContextType => {
	const context = useContext(ClusterContext);
	if (!context) {
		throw new Error(
			"useClusterContext must be used within a ClusterContextProvider"
		);
	}
	return context;
};
