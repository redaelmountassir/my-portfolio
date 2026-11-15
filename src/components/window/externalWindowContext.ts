import { createContext } from "react";

export const ExternalWindowDataContext = createContext<
	Record<string, any> | undefined
>(undefined);
