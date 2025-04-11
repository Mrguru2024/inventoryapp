import { Transponder } from "@/types/transponder";

export const fetchTransponders = async (): Promise<Transponder[]> => {
  // In a real implementation, this would make an API call
  return [];
};

export const createTransponder = async (
  transponder: Omit<Transponder, "id">
): Promise<Transponder> => {
  // In a real implementation, this would make an API call
  return { ...transponder, id: "1" };
};

export const updateTransponder = async (
  id: string,
  transponder: Partial<Transponder>
): Promise<Transponder> => {
  // In a real implementation, this would make an API call
  return { id, ...transponder } as Transponder;
};
