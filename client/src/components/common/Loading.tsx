import { useLoading } from "@/LoadingContext";
import { BeatLoader } from "react-spinners";

function Loading() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;
  return (
    <div className="flex justify-center items-center fixed top-0 left-0 w-screen h-screen z-[1000] bg-black bg-opacity-40">
      <BeatLoader color={"#ff6d3d"} size={24} speedMultiplier={1} />
    </div>
  );
}
export default Loading;
