import { Button } from "antd";
import { useRouter } from "next/router";
import Image from "next/image";

const Custom404 = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <h1 className="text-4xl font-bold text-gray-800 mb-5">
        Oops! Page Not Found
      </h1>

      <p className="text-gray-600">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>

      <div className="w-[800] h-[600] overflow-hidden">
        <Image
          src="/page-not-found.webp"
          alt="404 Not Found"
          className="scale-150"
          width={800}
          height={600}
        />
      </div>

      <div className="flex flex-wrap gap-8">
        <Button
          size="large"
          className="px-16 rounded-full"
          type="primary"
          onClick={() => router.push("/")}
        >
          Go Home
        </Button>
        <Button
          size="large"
          className="px-16 rounded-full"
          danger
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default Custom404;
