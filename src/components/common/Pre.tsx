import React from "react";
import CopyButton from "./CopyButton";

interface PreProps {
  className?: string;
  children: string;
}

const Pre = ({ className, children }: PreProps) => {
  return (
    <div className={"relative " + className}>
      <pre className="p-5 pr-16 rounded-xl bg-gray-100 overflow-y-scroll">
        {children}
      </pre>

      <CopyButton
        copyText={children}
        className="absolute top-4 right-4 shadow rounded-lg border-none"
      />
    </div>
  );
};

export default Pre;
