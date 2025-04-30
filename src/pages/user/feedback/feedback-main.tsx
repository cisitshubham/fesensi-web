

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { z } from "zod"
import { addFeedback } from "@/api/api"
import { useMasterDropdown } from "@/pages/global-components/master-dropdown-context"
import { useParams } from "react-router"
import { useNavigate } from "react-router"

// Define the schema for validation
const feedbackSchema = z.object({
    selectedRating: z.number({ required_error: "Please select a rating" }),
    category: z.string().nonempty("Please select a category"),
    comment: z.string().optional(),
});

export default function FeedbackPage() {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>();
    const masterDropdown = useMasterDropdown()
    const feedbackCategories = masterDropdown.dropdownData?.feedbackOptions || []
    const [selectedRating, setSelectedRating] = useState<number | null>(null)
    const [category, setCategory] = useState<string>("")
    const [comment, setComment] = useState<string>("")
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            // Validate the form data
            feedbackSchema.parse({
                selectedRating,
                category,
                comment,
            });

            // Prepare the data for the API call
            const formData = new FormData();
            formData.append("rating", selectedRating?.toString() || "");
            formData.append("feedbackOptions", category);
            formData.append("comment", comment || "");
            formData.append("ticket", id || "");

            // Call the addFeedback API
            const result = await addFeedback(formData);
            console.log(result, "result")

            if (!result || !result.data) {
                toast.error("Invalid response from server.", {
                    position: "top-center",
                });
                throw new Error("Invalid response from server.");
            }

            if (result.success) {
                toast.success("Feedback submitted successfully", {
                    position: "top-center",
                });

                // Reset form
                setSelectedRating(null);
                setCategory("");
                setComment("");
                navigate("/user/myTickets"); // Redirect to the tickets page after submission
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Map validation errors to the errors state
                const fieldErrors: { [key: string]: string } = {};
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        fieldErrors[err.path[0]] = err.message;
                    }
                });
                setErrors(fieldErrors);
            } else {
                toast.error("Failed to submit feedback. Please try again.", {
                    position: "top-center",
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const emojis = [
        { value: 1, emoji: "😢" },
        { value: 2, emoji: "😕" },
        { value: 3, emoji: "😐" },
        { value: 4, emoji: "🙂" },
        { value: 5, emoji: "😄" },
    ]

    return (
        <div className=" px-6 py-10">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Share Your Feedback</CardTitle>
                    <CardDescription>We'd love to hear about your experience with our service</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Card className="flex justify-between items-center mx-auto max-w-md p-4">
                                {emojis.map((emoji) => (
                                    <button
                                        key={emoji.value}
                                        type="button"
                                        onClick={() => setSelectedRating(emoji.value)}
                                        className={`flex flex-col items-center p-3 rounded-lg transition-all ${selectedRating === emoji.value ? "bg-primary/10 scale-150" : "hover:bg-muted"
                                            }`}
                                    >
                                        <span className="text-4xl mb-1">{emoji.emoji}</span>
                                    </button>
                                ))}
                            </Card>
                            {errors.selectedRating && <p className="text-red-500 text-sm">{errors.selectedRating}</p>}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="category" className="text-sm font-medium">
                                What are you providing feedback about?
                            </label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                {feedbackCategories.map((reason: any) => (
                                    <SelectItem key={reason._id || reason.title} value={String(reason._id)}>
                                        {reason.title}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="comment" className="text-sm font-medium">
                                Additional comments
                            </label>
                            <Textarea
                                id="comment"
                                placeholder="Tell us more about your experience..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={5}
                            />
                            {errors.comment && <p className="text-red-500 text-sm">{errors.comment}</p>}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-fit" disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit Feedback"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
