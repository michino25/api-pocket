import { ButtonProps, Modal } from "antd";
import CustomButton from "./CustomButton";

const DeleteButton = ({
  mutate,
  info,
  children = "Delete",
  ...rest
}: {
  mutate: () => void;
  info: string;
} & ButtonProps) => {
  const [modal, contextHolder] = Modal.useModal();

  const handleDelete = async () => {
    modal.confirm({
      title: `${children} confirmation`,
      content: `Are you sure you want to ${children
        ?.toString()
        .toLowerCase()} ${info}?`,
      onOk: mutate,
      onCancel: () => {},
    });
  };

  return (
    <>
      <CustomButton action="delete" onClick={handleDelete} {...rest}>
        {children}
      </CustomButton>
      {contextHolder}
    </>
  );
};

export default DeleteButton;
