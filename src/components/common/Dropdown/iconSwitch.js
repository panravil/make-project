import { BsLightningCharge, BsPeople } from "react-icons/bs";
import {
  IoExtensionPuzzleOutline,
  IoSunnyOutline,
  IoBookOutline,
  IoChatbubblesOutline,
  IoHelpCircleOutline,
  IoPlayOutline,
  IoAddCircleOutline,
  IoEarthOutline,
  IoCubeOutline,
  IoStarOutline,
  IoCardOutline,
} from "react-icons/io5";
import { VscGraph } from "react-icons/vsc";

export const renderIcon = (logo, className) => {
  switch (logo) {
    case "Platform":
      return <BsLightningCharge className={className} />;
    case "Product":
      return <BsLightningCharge className={className} />;
    case "OEM":
      return <IoCubeOutline className={className} />;
    case "Enterprise":
      return <IoEarthOutline className={className} />;
    case "Templates":
      return <IoExtensionPuzzleOutline className={className} />;
    case "Use cases":
      return <VscGraph className={className} />;
    case "Apps & services":
      return <IoAddCircleOutline className={className} />;
    case "Pricing":
      return <IoCardOutline className={className} />;
    case "Blog":
      return <IoBookOutline className={className} />;
    case "Webinars":
      return <IoPlayOutline className={className} />;
    case "Community":
      return <IoChatbubblesOutline className={className} />;
    case "Find a partner":
      return <BsPeople className={className} />;
    case "Help":
      return <IoHelpCircleOutline className={className} />;

    default:
      return <IoStarOutline className={className} />;
  }
};
