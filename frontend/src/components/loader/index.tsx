import Lottie from "lottie-react";
// import animation from "./please-wait.json";
import animation from "./sand-clock.json";

function Loader({ className }: { className?: string }) {
  return <Lottie className={className} animationData={animation} loop={true} />;
}

export default Loader;
