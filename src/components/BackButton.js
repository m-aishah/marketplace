import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  const router = useRouter();

  return (
    <div className="self-start mb-4">
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        <span className="text-sm font-medium">Back</span>
      </button>
    </div>
  );
};

export default BackButton;
