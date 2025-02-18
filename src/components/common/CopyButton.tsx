import React, { useState } from "react";
import CustomButton, { CustomButtonProps } from "./CustomButton";
import { Check, Copy } from "lucide-react";
import { useNotification } from "@/hooks/useNotification";

const CopyButton = ({
  copyText,
  onClick,
  ...rest
}: { copyText: string } & CustomButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const notification = useNotification();

  const handleCopy = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      notification.error("Failed to copy text:");
    }
  };

  return (
    <CustomButton
      onClick={(e) => {
        onClick?.(e);
        handleCopy(copyText);
      }}
      icon={isCopied ? <Check size={16} /> : <Copy size={16} />}
      {...rest}
    />
  );
};

export default CopyButton;
