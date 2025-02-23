import { useRouter } from "next/router";
import CustomButton from "../common/CustomButton";
import Image from "next/image";

interface NoticeProps {
  title: string;
  subtitle: string;
  imageHeight?: number;
  showGoHome?: boolean;
  showGoBack?: boolean;
}

const Notice = ({
  title,
  subtitle,
  imageHeight = 500,
  showGoHome = true,
  showGoBack = true,
}: NoticeProps) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-full bg-white">
      <h1 className="text-4xl font-bold text-gray-800 mb-1">{title}</h1>

      <p className="text-gray-600">{subtitle}</p>

      <Image
        src="/sleeping-cat.webp"
        alt="404 Not Found"
        className="object-contain"
        width={800}
        height={imageHeight}
      />

      <div className="flex flex-wrap gap-8">
        <CustomButton
          size="large"
          className="px-16 rounded-full"
          danger
          onClick={() => router.push("/")}
          hidden={!showGoHome}
        >
          Go Home
        </CustomButton>
        <CustomButton
          size="large"
          className="px-16 rounded-full"
          type="primary"
          onClick={() => router.back()}
          hidden={!showGoBack}
        >
          Go Back
        </CustomButton>
      </div>
    </div>
  );
};

export default Notice;
