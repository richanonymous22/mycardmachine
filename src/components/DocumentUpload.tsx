import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface DocumentUploadProps {
  applicationId: string;
  requiredDocuments: string[];
  onUploadComplete?: (allUploaded: boolean) => void;
}

interface UploadedFile {
  name: string;
  type: string;
  size: number;
  path: string;
  status: "uploading" | "uploaded" | "error";
  progress: number;
}

export const DocumentUpload = ({ applicationId, requiredDocuments, onUploadComplete }: DocumentUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const { toast } = useToast();

  // Calculate upload progress
  const uploadedCount = uploadedFiles.filter(f => f.status === "uploaded").length;
  const totalRequired = requiredDocuments.length;
  const allDocumentsUploaded = uploadedCount >= totalRequired;

  // Notify parent component when all documents are uploaded
  useEffect(() => {
    if (onUploadComplete) {
      onUploadComplete(allDocumentsUploaded);
    }
  }, [allDocumentsUploaded, onUploadComplete]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      const fileEntry: UploadedFile = {
        name: file.name,
        type: file.type,
        size: file.size,
        path: "",
        status: "uploading",
        progress: 0,
      };

      setUploadedFiles(prev => [...prev, fileEntry]);

      try {
        // Upload to Supabase Storage
        const fileName = `${applicationId}/${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
          .from("application-documents")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) throw error;

        // Save document record to database
        const { error: dbError } = await supabase
          .from("application_documents")
          .insert({
            application_id: applicationId,
            document_type: file.name.split('.')[0],
            file_path: data.path,
            file_name: file.name,
            file_size: file.size,
          });

        if (dbError) throw dbError;

        setUploadedFiles(prev =>
          prev.map(f =>
            f.name === file.name && f.status === "uploading"
              ? { ...f, path: data.path, status: "uploaded", progress: 100 }
              : f
          )
        );

        toast({
          title: "Document uploaded",
          description: `${file.name} uploaded successfully`,
        });
      } catch (error: any) {
        setUploadedFiles(prev =>
          prev.map(f =>
            f.name === file.name && f.status === "uploading"
              ? { ...f, status: "error", progress: 0 }
              : f
          )
        );

        toast({
          title: "Upload failed",
          description: error.message || "Failed to upload document",
          variant: "destructive",
        });
      }
    }
  }, [applicationId, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/pdf": [".pdf"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(f => f.name !== fileName));
  };

  return (
    <div className="space-y-4">
      {/* Document Upload Progress */}
      <Card className="p-3 sm:p-4 bg-muted/50">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs sm:text-sm font-semibold">Upload Progress</h4>
          <span className={`text-xs sm:text-sm font-bold ${allDocumentsUploaded ? 'text-green-500' : 'text-muted-foreground'}`}>
            {uploadedCount} of {totalRequired} uploaded
          </span>
        </div>
        <Progress value={(uploadedCount / totalRequired) * 100} className="h-2" />
        
        {/* Required Documents Checklist */}
        <div className="mt-3 space-y-1.5">
          {requiredDocuments.map((doc, index) => {
            const isUploaded = uploadedFiles.some(f => f.status === "uploaded" && index < uploadedCount);
            return (
              <div key={doc} className="flex items-center gap-2 text-xs sm:text-sm">
                <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isUploaded ? 'bg-green-500' : 'bg-muted border-2 border-muted-foreground/30'
                }`}>
                  {isUploaded && <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />}
                </div>
                <span className={isUploaded ? 'text-foreground' : 'text-muted-foreground'}>
                  {doc}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      <Card
        {...getRootProps()}
        className={`p-4 sm:p-8 border-2 border-dashed cursor-pointer transition-all ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center space-y-2 sm:space-y-3">
          <div className="inline-flex p-3 sm:p-4 rounded-full bg-primary/10">
            <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
          <div>
            <p className="text-sm sm:text-base font-semibold">
              {isDragActive ? "Drop files here" : "Drag & drop files here"}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              or click to browse (PDF, JPG, PNG - max 10MB)
            </p>
          </div>
        </div>
      </Card>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs sm:text-sm font-semibold">Uploaded Documents</h4>
          {uploadedFiles.map((file) => (
            <Card key={file.name} className="p-2 sm:p-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium truncate">{file.name}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                  {file.status === "uploading" && (
                    <Progress value={file.progress} className="mt-1 h-1" />
                  )}
                </div>
                {file.status === "uploaded" && (
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                )}
                {file.status === "error" && (
                  <span className="text-[10px] sm:text-xs text-destructive">Failed</span>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(file.name)}
                  className="flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
