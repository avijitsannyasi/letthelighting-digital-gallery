import { getSliderImages, getSiteConfig } from "./lib/galleryData";
import ImageSlider from "./components/ImageSlider";
import LoginForm from "./components/LoginForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Client Gallery Access | Let the Light In",
  description: "Access your private photography gallery with your unique access code.",
};

export default async function Home() {
  const sliderImages = await getSliderImages();
  const siteConfig = await getSiteConfig();

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="relative h-[40vh] w-full lg:h-screen lg:w-1/2">
        <ImageSlider slides={sliderImages} />
      </div>
      <div className="min-h-[60vh] w-full lg:h-screen lg:w-1/2 lg:overflow-y-auto">
        <LoginForm siteConfig={siteConfig} />
      </div>
    </div>
  );
}
