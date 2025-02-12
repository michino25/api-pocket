import CustomButton from "./CustomButton";

type TProps = {
  loading?: boolean;
  onHandle: () => void;
  onCancel?: () => void;
  handleText?: string;
  cancelText?: string;
  hidden?: boolean;
};

const ActionButton = ({
  loading,
  onHandle,
  onCancel,
  handleText = "Save",
  cancelText = "Cancel",
  hidden = false,
}: TProps) => {
  return (
    !hidden && (
      <div className="handle-button-position flex gap-2 mt-6 bg-white/80 border border-gray-200 p-2 rounded-full">
        {onCancel && (
          <CustomButton onClick={onCancel} action="cancel" disabled={loading}>
            {cancelText}
          </CustomButton>
        )}
        <CustomButton
          onClick={onHandle}
          type="primary"
          action="save"
          disabled={loading}
        >
          {handleText}
        </CustomButton>
      </div>
    )
  );
};

export default ActionButton;
