import React, { useState } from "react";
import { Alert, AlertTitle, AlertDescription, AlertAction } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X, Info, AlertTriangle, AlertCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertComponentProps {
  title: string;
  description?: string;
  variant?: "default" | "info" | "warning" | "destructive" | "error" | "success";
  className?: string;
}

export function AlertComponent({ 
  title, 
  description, 
  variant = "default", 
  className
}: AlertComponentProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const variantConfig = {
    default: {
      icon: Info,
      className: "border-gray-500/50 bg-gray-50 text-gray-900 dark:bg-gray-950/50 dark:text-gray-200",
      shadcnVariant: "default" as const,
    },
    success: {
      icon: Check,
      className: "border-green-500/50 bg-green-50 text-green-900 dark:bg-green-950/50 dark:text-green-200",
      shadcnVariant: "default" as const,
    },
    info: {
      icon: Info,
      className: "border-blue-500/50 bg-blue-50 text-blue-900 dark:bg-blue-950/50 dark:text-blue-200",
      shadcnVariant: "default" as const,
    },
    warning: {
      icon: AlertTriangle,
      className: "border-yellow-500/50 bg-yellow-50 text-yellow-900 dark:bg-yellow-950/50 dark:text-yellow-200",
      shadcnVariant: "default" as const,
    },
    destructive: {
      icon: AlertCircle,
      className: "border-red-500/50 bg-red-50 text-red-900 dark:bg-red-950/50 dark:text-red-200",
      shadcnVariant: "destructive" as const,
    },
    error: {
      icon: AlertCircle,
      className: "border-red-500/50 bg-red-50 text-red-900 dark:bg-red-950/50 dark:text-red-200",
      shadcnVariant: "destructive" as const,
    },
  };

  const currentConfig = variantConfig[variant] || variantConfig.default;
  const IconComponent = currentConfig.icon;

  return (
    <Alert 
      variant={currentConfig.shadcnVariant} 
      className={cn("relative", currentConfig.className, className)}
    >
      <IconComponent className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
      <AlertAction>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-foreground"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertAction>
    </Alert>
  );
}