import { getSLA } from "@/api/agent";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { SLAStatustype } from "@/types";



export default function SlastatusAgent() {
  const [slaData, setSlaData] = useState<SLAStatustype[]>([]);

  const fetchSLA = async () => {
    try {
      const response = await getSLA();
      setSlaData(response.data);
    } catch (error) {
      console.error("Error fetching SLA data:", error);
    }
  };

  useEffect(() => {
    fetchSLA();
  }, []);

  return (
    <div className="flex flex-col p-4">
      {Array.isArray(slaData) && slaData.length > 0 ? (
        slaData.map((sla, idx) => (
          <Card key={idx} className="mb-4 p-4">
            <h3 className="text-lg font-semibold">Priority: {sla.priority}</h3>
            <p className="text-gray-600">Response Time: {sla.response_time} hours</p>
            <p className="text-gray-600">Created At: {sla.createdAt}</p>
          </Card>
        ))
      ) : (
        <div className="text-gray-500">No SLA data found.</div>
      )}
    </div>
  );
}