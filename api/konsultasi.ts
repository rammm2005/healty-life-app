import axios from "axios";

interface KonsultasiResponse {
    saran: string;
}

const API_URL = process.env.BACKEND_API_URL || "";

export const fetchKonsultasi = async (keluhan: string, file: JSON[]): Promise<KonsultasiResponse> => {
    const response = await axios.post<KonsultasiResponse>(API_URL, { keluhan, file });
    return response.data;
};
