
import { getTrustlevel } from "@/api/agent";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import ReactSpeedometer from "react-d3-speedometer"
export default function TrustPgeAgent() {

    const [trustLevel, setTrustLevel] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const fetchTrustLevel = async () => {
        try {
            const response = await getTrustlevel();
            if (response.success) {
                setLoading(false);
                setError(null);
                setTrustLevel(response.data);
            } else {
                throw new Error(response.message || "Failed to fetch trust level");
            }
        } catch (error: any) {
            setError("Failed to fetch trust level. Please try again later.");
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchTrustLevel();
    }, []);


    return (
        <Card className="flex flex-col mx-8">

            <ReactSpeedometer
                value={333}
                needleHeightRatio={0.7}
            />



        </Card>
    );
}