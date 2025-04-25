import { GetMasterDropdown } from "@/api/api";

export default async function MasterDropdownData() {
    try {
        const response = await GetMasterDropdown();
        return response.data;
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch master dropdown";
        throw new Error(message);
    }
}