"use client"

import { forwardRef, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import axios from "axios"
import { Pencil, Save, X, RefreshCw, MessageSquare, MoreVertical, Clock, CheckCircle2, Filter } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { updateAnnouncement } from "@/api/api"
import { KeenIcon } from "@/components"
import { deleteAnnouncement } from "@/api/admin"
import { toast } from "sonner"
import { position } from "stylis"
import { AnnouncementSkeleton } from "@/components/skeletons"

interface Announcement {
  _id: string
  title: string
  content: string
  createdAt: string
}

export interface AnnouncementsViewRef {
  fetchAnnouncements: () => void
}

interface AnnouncementsViewProps {
  announcements: Announcement[]
  isLoading: boolean
}

const AnnouncementsView = forwardRef<AnnouncementsViewRef, AnnouncementsViewProps>(
  ({ announcements, isLoading }, ref) => {
    const [editModes, setEditModes] = useState<Record<string, boolean>>({})
    const [titles, setTitles] = useState<Record<string, string>>(
      Object.fromEntries(announcements.map((a) => [a._id, a.title])),
    )
    const [contents, setContents] = useState<Record<string, string>>(
      Object.fromEntries(announcements.map((a) => [a._id, a.content])),
    )
    const [originalTitles, setOriginalTitles] = useState<Record<string, string>>({})
    const [originalContents, setOriginalContents] = useState<Record<string, string>>({})
    const [savingIds, setSavingIds] = useState<Set<string>>(new Set())
    const [successIds, setSuccessIds] = useState<Set<string>>(new Set())
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")

    const sortedAnnouncements = [...announcements].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })

    const handleToggleEdit = (id: string, originalTitle: string, originalContent: string) => {
      setEditModes((prev) => {
        const isEditing = !prev[id]
        if (isEditing) {
          setOriginalTitles((ot) => ({ ...ot, [id]: originalTitle }))
          setOriginalContents((oc) => ({ ...oc, [id]: originalContent }))
        }
        return { ...prev, [id]: isEditing }
      })
    }

    const handleTitleChange = (id: string, value: string) => {
      setTitles((prev) => ({ ...prev, [id]: value }))
    }

    const handleContentChange = (id: string, value: string) => {
      setContents((prev) => ({ ...prev, [id]: value }))
    }

    const handleCancel = (id: string) => {
      setTitles((prev) => ({ ...prev, [id]: originalTitles[id] }))
      setContents((prev) => ({ ...prev, [id]: originalContents[id] }))
      setEditModes((prev) => ({ ...prev, [id]: false }))
    }

    const handleSave = async (id: string, currentTitle: string, currentContent: string) => {
      setSavingIds((prev) => new Set(prev).add(id))
      const formData = new FormData();
      formData.append('title', currentTitle);
      formData.append('content', currentContent);
      try {
        await updateAnnouncement(formData, id);
        setEditModes((prev) => ({ ...prev, [id]: false }))

        // Show success indicator briefly
        setSuccessIds((prev) => new Set(prev).add(id))
        setTimeout(() => {
          setSuccessIds((prev) => {
            const updated = new Set(prev)
            updated.delete(id)
            return updated
          })
        }, 2000)
      } catch (error) {
        console.error("Failed to update announcement:", error)
      } finally {
        setSavingIds((prev) => {
          const updated = new Set(prev)
          updated.delete(id)
          return updated
        })
      }
    }

    const toggleSortOrder = () => {
      setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
    }

    const getInitials = (title: string) => {
      return title
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    }

    const getTimeAgo = (dateString: string) => {
      const date = new Date(dateString)
      const now = new Date()
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

      if (diffInSeconds < 60) {
        return "just now"
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60)
        return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600)
        return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
      } else if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400)
        return `${days} ${days === 1 ? "day" : "days"} ago`
      } else {
        return date.toLocaleDateString()
      }
    }


    // Ensure the component refreshes by invoking fetchAnnouncements directly
    const handleDeleteAnnouncement = async (id: string) => {
      try {
        const response = await deleteAnnouncement(id);
        if (response.success) {
          toast.success("Announcement deleted successfully", { position: "top-center" });

          // Optionally, you can also remove the announcement from the state
          setEditModes((prev) => {
            const updated = { ...prev };
            delete updated[id];
            return updated;
          });
          setTitles((prev) => {
            const updated = { ...prev };
            delete updated[id];
            return updated;
          });
          setContents((prev) => {
            const updated = { ...prev };
            delete updated[id];
            return updated;
          });
          setOriginalTitles((prev) => {
            const updated = { ...prev };
            delete updated[id];
            return updated;
          });
          setOriginalContents((prev) => {
            const updated = { ...prev };
            delete updated[id];
            return updated;
          });
          setSuccessIds((prev) => {
            const updated = new Set(prev);
            updated.delete(id);
            return updated;
          });
          setSavingIds((prev) => {
            const updated = new Set(prev);
            updated.delete(id);
            return updated;
          });

          // Refresh sortedAnnouncements
          const updatedAnnouncements = announcements.filter((announcement) => announcement._id !== id);
          const sorted = [...updatedAnnouncements].sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
          });

          // Update the announcements state
          announcements.length = 0;
          announcements.push(...sorted);

          // Refresh the component by invoking fetchAnnouncements
          if (typeof ref === 'function') {
            ref({ fetchAnnouncements: () => { } }); // Ensure ref is invoked correctly
          } else if (ref?.current?.fetchAnnouncements) {
            ref.current.fetchAnnouncements();
          }
        } else {
          console.error("Failed to delete announcement")
        }
      }
      catch (error) {
        console.error("Error deleting announcement:", error)
        toast.error("Failed to delete announcement", { position: "top-center" })
      }

    }


    if (isLoading) {
      return <AnnouncementSkeleton />;
    }

    if (announcements.length === 0) {
      return (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
            <CardDescription>View and manage all announcements</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="flex flex-col items-center justify-center h-64 space-y-4 py-12">
            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
              <MessageSquare className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-medium">No announcements</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                There are no announcements to display at this time. New announcements will appear here when they're
                created.
              </p>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card className="w-full">
        <CardHeader className="pb-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Announcements</CardTitle>
              <CardDescription>View and manage all announcements</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={toggleSortOrder} className="text-xs h-8">
                <Filter className="h-3.5 w-3.5 mr-1" />
                {sortOrder === "newest" ? "Newest first" : "Oldest first"}
              </Button>
              <Badge variant="outline">
                {announcements.length} {announcements.length === 1 ? "announcement" : "announcements"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <ScrollArea className="h-[60vh]">
          <CardContent className="p-6">
            <div className="space-y-6">
              {sortedAnnouncements.map((announcement) => {
                const id = announcement._id
                const isEditing = editModes[id] || false
                const currentTitle = titles[id] ?? announcement.title
                const currentContent = contents[id] ?? announcement.content
                const originalTitle = announcement.title
                const originalContent = announcement.content
                const isDirty = currentTitle !== originalTitle || currentContent !== originalContent
                const isSaving = savingIds.has(id)
                const isSuccess = successIds.has(id)
                const timeAgo = getTimeAgo(announcement.createdAt)

                return (
                  <Card key={id} className="group">
                    <CardContent className="pt-4">
                      <div className={`rounded-lg transition-all duration-200 ${isEditing ? "bg-muted/50 p-4 -mx-4" : ""}`}>
                        <div className="flex gap-4">
                          <Avatar className="h-10 w-10 mt-1">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {getInitials(originalTitle)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                {isEditing ? (
                                  <Input
                                    value={currentTitle}
                                    onChange={(e) => handleTitleChange(id, e.target.value)}
                                    className="font-medium"
                                  placeholder="Announcement title"
                                  />
                                ) : (
                                  <h4 className="text-base font-medium">{currentTitle}</h4>
                                )}

                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>{timeAgo}</span>

                                  {isSuccess && (
                                    <Badge variant="outline" className="ml-2 text-green-500 border-green-200 bg-green-50">
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      Saved
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              {!isEditing && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8  transition-opacity"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                      <span className="sr-only">Actions</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleToggleEdit(id, originalTitle, originalContent)}>
                                      <Pencil className="h-4 w-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDeleteAnnouncement(id)}>
                                      <KeenIcon icon="trash" className="h-4 w-4 mr-2" />
                                      Deactivate
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>

                            <div className="relative">
                              {isEditing ? (
                                <Textarea
                                  value={currentContent}
                                  onChange={(e) => handleContentChange(id, e.target.value)}
                                  className="min-h-[100px]"
                                  placeholder="Announcement content"
                                />
                              ) : (
                                <div className="text-sm text-muted-foreground whitespace-pre-wrap">{currentContent}</div>
                              )}
                            </div>

                            {isEditing && (
                              <div className="flex justify-end gap-2 pt-2">
                                <Button variant="outline" size="sm" onClick={() => handleCancel(id)}>
                                  <X className="h-3.5 w-3.5 mr-1" />
                                  Cancel
                                </Button>
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleSave(id, currentTitle, currentContent)}
                                  disabled={!isDirty || isSaving}
                                >
                                  {isSaving ? (
                                    <>
                                      <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" />
                                      Saving
                                    </>
                                  ) : (
                                    <>
                                      <Save className="h-3.5 w-3.5 mr-1" />
                                      Save
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </ScrollArea>
      </Card>
    )
  },
)

AnnouncementsView.displayName = "AnnouncementsView"

export default AnnouncementsView
