import { getSLA } from "@/api/agent";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SLAStatustype } from "@/types";
import { getStatusBadge, getPriorityBadge } from "@/pages/global-components/GetStatusColor";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";



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
          <Card key={idx} className={`mb-4 overflow-hidden ${getPriorityBadge(sla.priority).border}`}>

            <CardContent className="p-4">


            <h3 className="text-lg font-semibold">Priority:<Badge className={`${getPriorityBadge(sla.priority).color}`}> {sla.priority} </Badge> </h3>
           <div className="flex flex-row justify-between items-baseline"> 
            <p className="text-gray-600">Resolution Time: {sla.response_time} hours</p>
            <p className="text-gray-600">Created At: {sla.createdAt}</p>
           </div>
            </CardContent>

          </Card>
        ))
      ) : (
        <div className="text-gray-500">No SLA data found.</div>
      )}
    </div>
  );
}