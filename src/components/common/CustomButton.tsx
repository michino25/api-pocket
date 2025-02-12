import React from "react";
import { Button, ButtonProps, Tooltip } from "antd";
import Link from "next/link";
import {
  ArrowLeft,
  CirclePlus,
  Download,
  Pencil,
  Save,
  TextSearch,
  Trash,
  Upload,
  X,
} from "lucide-react";

export interface CustomButtonProps extends ButtonProps {
  to?: string;
  target?: string;
  tooltip?: string;
  action?: keyof typeof iconVariants;
}

const iconVariants = {
  add: <CirclePlus size={16} />,
  edit: <Pencil size={16} />,
  delete: <Trash size={16} />,
  view: <TextSearch size={16} />,
  save: <Save size={16} />,
  cancel: <X size={16} />,
  download: <Download size={16} />,
  upload: <Upload size={16} />,
  back: <ArrowLeft size={16} />,
};

const CustomButton = ({
  to,
  target,
  tooltip,
  children,
  className,
  action,
  hidden,
  ...rest
}: CustomButtonProps) => {
  const button = (
    <Button
      icon={action && iconVariants[action]}
      className={className + " [&>.ant-btn-icon]:flex"}
      {...rest}
    >
      {children}
    </Button>
  );

  const linkedButton = to ? (
    <Link href={to} target={target}>
      {button}
    </Link>
  ) : (
    button
  );
  if (!hidden)
    return tooltip ? (
      <Tooltip title={tooltip}>{linkedButton}</Tooltip>
    ) : (
      linkedButton
    );
};

export default CustomButton;
