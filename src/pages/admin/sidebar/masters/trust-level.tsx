import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Save, X } from "lucide-react"
import { getTrustLevelInfo,updateTrustLevelInfo } from "@/api/admin"
import { toast } from "sonner"

type ServiceLevel = {
  _id: string
  level: string
  levelInfo: string
  min: number
  weights: {
    notResolved: number
    responseTime: number
    [key: string]: number
  }
  createdAt: string
  updatedAt: string
}

export default function TrustLevels() {
  const [data, setData] = useState<ServiceLevel[]>([])
  const [editMap, setEditMap] = useState<Record<string, boolean>>({})
  const [editData, setEditData] = useState<Record<string, ServiceLevel>>({})

  const fetchApprovedList = async () => {
    try {
      const response = await getTrustLevelInfo()
      setData(response.data)
      // Initialize editing data
      const initialEditData: Record<string, ServiceLevel> = {}
      const initialEditMap: Record<string, boolean> = {}
      response.data.forEach((item: ServiceLevel) => {
        initialEditData[item._id] = item
        initialEditMap[item._id] = false
      })
      setEditData(initialEditData)
      setEditMap(initialEditMap)
    } catch (error) {
      console.error("Error fetching:", error)
      toast.error("Failed to fetch trust levels", { position: "top-center" })
    }
  }

  useEffect(() => {
    fetchApprovedList()
  }, [])

  const handleEditToggle = (id: string) => {
    setEditMap((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleSave = async (id: string) => {
    const updatedItem = {
      ...editData[id],
      updatedAt: new Date().toISOString(),
    };

    // Calculate the sum of weights with tolerance for floating-point precision
    const weightSum = Object.values(updatedItem.weights).reduce((sum, value) => sum + value, 0);
    const tolerance = 0.0000001; // Small tolerance for floating-point comparison
    
    if (Math.abs(weightSum - 1) > tolerance) {
      toast.error("The sum of weights must equal 1", { position: "top-center" });
      return;
    }

    // Format data according to required structure
    const formData = new FormData();
    
    // Add base fields
    formData.append("level", updatedItem.level );
    formData.append("levelInfo", updatedItem.levelInfo );
    formData.append("min", updatedItem.min.toString() );
    
    // Add weights
    Object.entries(updatedItem.weights).forEach(([key, value]) => {
      formData.append(`${key}`, value.toString() );
    });

    const response = await updateTrustLevelInfo(formData, id);
    
    if (response?.data?.success) {
      setData((prev) => prev.map((item) => (item._id === id ? updatedItem : item)));
      setEditMap((prev) => ({ ...prev, [id]: false }));
      toast.success("Trust level updated", { position: "top-center" });
    } else {
      console.error("Update failed:", response?.data?.message || "Unknown error");
      toast.error("Failed to update trust level", { position: "top-center" });
    }
  };

  const handleCancel = (id: string) => {
    const original = data.find((d) => d._id === id)
    if (original) {
      setEditData((prev) => ({ ...prev, [id]: original }))
      setEditMap((prev) => ({ ...prev, [id]: false }))
    }
  }

  const updateWeight = (
    id: string,
    key: keyof ServiceLevel["weights"],
    value: number
  ) => {
    setEditData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        weights: { ...prev[id].weights, [key]: value },
      },
    }))
  }

  return (
    <Card className="space-y-8 mx-8">
        <CardHeader className="flex flex-row justify-between">

      <CardTitle className="text-2xl font-bold flex flex-row justify-between">Trust Levels Configuration</CardTitle>
        {/* <Button className="w-fit">Add New</Button> */}
        </CardHeader>
      <CardContent className="space-y-4">

      
      {data.map((item) => {
        const isEditing = editMap[item._id]
        const current = isEditing ? editData[item._id] : item

        return (
          <Card key={item._id} className="">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  {isEditing ? (
                    <Input
                      value={current.level}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          [item._id]: { ...prev[item._id], level: e.target.value },
                        }))
                      }
                    />
                  ) : (
                    <CardTitle>{item.level}</CardTitle>
                  )}
                  <Badge variant={"outline"}>
                    Minimum Score:{" "}
                    {isEditing ? (
                      <Input
                      
                        type="number"
                        step="0.1"
                        value={current.min}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            [item._id]: {
                              ...prev[item._id],
                              min: parseFloat(e.target.value),
                            },
                          }))
                        }
                        className="w-16 h-6 ml-2  outline-none"
                      />
                    ) : (
                      <span className="ml-1">{item.min}</span>
                    )}
                  </Badge>
                </div>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancel(item._id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSave(item._id)}
                      className="flex gap-1"
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditToggle(item._id)}
                    className="flex gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                )}
              </div>

              {isEditing ? (
                <Textarea
                  value={current.levelInfo}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      [item._id]: { ...prev[item._id], levelInfo: e.target.value },
                    }))
                  }
                  className="mt-2"
                />
              ) : (
                <CardDescription>{item.levelInfo}</CardDescription>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4 text-lg">Weight Distribution</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(current.weights).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="capitalize font-medium text-sm">
                          {key === "notResolved"
                            ? "Not Resolved"
                            : key === "responseTime"
                            ? "Response Time"
                            : key}
                        </span>
                        <span className="text-sm font-semibold">
                          {(value )}
                        </span>
                      </div>
                      {isEditing ? (
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="1"
                          value={value}
                          onChange={(e) =>
                            updateWeight(item._id, key as keyof ServiceLevel["weights"], parseFloat(e.target.value))
                          }
                        />
                      ) : (
                        <div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
                          <div
                            className="bg-blue-500 h-full"
                            style={{ width: `${value * 100}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Created: {new Date(item.createdAt).toLocaleString()}</span>
                  <span>Updated: {new Date(item.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
      </CardContent>
    </Card>
  )
}
