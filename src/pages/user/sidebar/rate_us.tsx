import { GetSkippedFeedback } from "@/api/user";
import { Card, CardFooter, CardTitle } from "@/components/ui/card";
import { CardContent, CardHeader } from "@mui/material";
import { set } from "date-fns";
import { map } from "leaflet";
import { useEffect, useState } from "react";
import { Button } from "react-day-picker";
import { useNavigate } from "react-router";
export default function RateUsUser() {

    const [feedback, setFeedback] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [feedbackCount, setFeedbackCount] = useState(0);

    const fetchFeedback = async () => {
        try {
            const response = await GetSkippedFeedback();
            if (response.success) {
                setFeedbackCount(response.data.length);
                setLoading(false);
                setError(null);
                setFeedback(response.data);
            }
            setFeedback(response.data);
        } catch (error: any) {
            setError('Failed to fetch feedback. Please try again later.');
            setLoading(false);
            setError(error.message);
        
        }


    }
    useEffect(() => {
        fetchFeedback();
    }, []);


const navigate = useNavigate();

        return (
            <div className="flex flex-col w-full h-full mx-8 gap-4">
            {loading ? (
                <div className="flex justify-center items-center min-h-[200px] text-muted-foreground">Loading feedback...</div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center min-h-[200px] text-destructive">{error}</div>
            ) : feedback.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[200px] text-muted-foreground">No Pending Tickets.</div>
            ) : (
                <div className=" space-y-4">
                    {feedback.map((item) => (
                        <Card key={item._id} className="">
                            <CardContent className="">
                            <CardHeader className="">
                                <CardTitle className="text-xs text-gray-400">#{item.ticket_number}</CardTitle>
                                <span className="text-xs px-2 py-0.5 rounded-full  text-gray-500">{item.status}</span>
                            </CardHeader>
                            <div className="font-semibold text-lg text-gray-800">{item.title}</div>
                            <div className="text-sm text-gray-600 line-clamp-2">{item.description}</div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{item.priority}</span>
                                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{item.category}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-2">Assigned to: {item.assigned_to}</div>
                            <div className="text-xs text-gray-400">Created: {new Date(item.createdAt).toLocaleString()}</div>
                            </CardContent>
                            <CardFooter>
                                 <Button onClick={() => navigate(`/user/feedback/${item._id}`)}>Rate our service</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}