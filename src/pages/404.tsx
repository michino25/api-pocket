import Notice from "@/components/layout/Notice";

const Custom404 = () => {
  return (
    <div className="flex h-screen justify-center items-center">
      <Notice
        title="Oops! Page Not Found"
        subtitle="Sorry, we couldn't find the page you're looking for."
        imageHeight={600}
      />
    </div>
  );
};

export default Custom404;
