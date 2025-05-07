"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { Trash2, Upload, FileText, Search, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

interface KnowledgeFile {
  id: string
  name: string
  size: number
  type: string
  uploadedAt: Date
}

export default function KnowledgeBasePageAdmin() {
  const [files, setFiles] = useState<KnowledgeFile[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [deleteSuccess, setDeleteSuccess] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files

    if (!uploadedFiles) return

    const newFiles: KnowledgeFile[] = Array.from(uploadedFiles).map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
    }))

    setFiles((prev) => [...prev, ...newFiles])
    setUploadSuccess(true)

    // Reset success message after 3 seconds
    setTimeout(() => {
      setUploadSuccess(false)
    }, 3000)

    // Reset file input
    e.target.value = ""
  }

  const handleDelete = (id: string) => {
    setFiles(files.filter((file) => file.id !== id))
    setDeleteSuccess(true)

    // Reset success message after 3 seconds
    setTimeout(() => {
      setDeleteSuccess(false)
    }, 3000)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  const getFileTypeLabel = (type: string) => {
    if (type.includes("pdf")) return "PDF"
    if (type.includes("word") || type.includes("docx")) return "DOC"
    if (type.includes("text")) return "TXT"
    if (type.includes("image")) return "IMG"
    return "FILE"
  }

  const filteredFiles = files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="mx-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Knowledge Base Management</CardTitle>
          <CardDescription>Upload, manage, and organize your knowledge base files</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search files..."
                className="w-full pl-8 sm:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Input type="file" id="file-upload" className="hidden" multiple onChange={handleFileUpload} />
              <label htmlFor="file-upload">
                <Button asChild>
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Files
                  </span>
                </Button>
              </label>
            </div>
          </div>

        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Knowledge Base Files</CardTitle>
          <CardDescription>
            {filteredFiles.length} {filteredFiles.length === 1 ? "file" : "files"} in the knowledge base
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredFiles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                        {file.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getFileTypeLabel(file.type)}</Badge>
                    </TableCell>
                    <TableCell>{formatFileSize(file.size)}</TableCell>
                    <TableCell>{format(file.uploadedAt, "MMM d, yyyy h:mm a")}</TableCell>
                    <TableCell className="text-right">
                    
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No files found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery
                  ? "No files match your search criteria"
                  : "Upload files to your knowledge base to get started"}
              </p>
              {searchQuery && (
                <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
