import { FileText } from 'lucide-react';

interface TemplateInfoProps {
  templateId: string;
  templateName: string;
}

export function TemplateInfo({ templateId, templateName }: TemplateInfoProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5" />
        <h3 className="font-semibold">Template</h3>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs text-muted-foreground">Template ID</p>
          <p className="font-mono text-sm mt-1 break-all">{templateId}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Template Name</p>
          <p className="font-semibold text-sm mt-1">{templateName}</p>
        </div>
      </div>
    </div>
  );
}
