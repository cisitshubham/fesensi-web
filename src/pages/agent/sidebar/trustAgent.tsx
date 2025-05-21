
import { getTrustlevel } from "@/api/agent";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import ReactSpeedometer from "react-d3-speedometer"
export default function TrustPgeAgent() {

    const [trustLevel, setTrustLevel] = useState<number>();
    const [remarks, setRemarks] = useState<string>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const fetchTrustLevel = async () => {
        try {
            const response = await getTrustlevel();
            if (response.success) {
                setLoading(false);
                setError(null);
                setTrustLevel(response.data.scrore);
                setRemarks(response.data.level);
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
            <CardContent>



            <ReactSpeedometer
                value={52}
                currentValueText={'52'}
                needleHeightRatio={0.7}
                minValue={0}
                maxValue={100}
                needleColor="black"
                ringWidth={10}
                />
                </CardContent>



        </Card>
    );
}