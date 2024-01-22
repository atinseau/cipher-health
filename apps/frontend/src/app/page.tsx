import HeroBanner from "@/components/Layout/HeroBanner";
import PageContainer from "@/components/Layout/PageContainer";

export default function Page() {

  return <PageContainer>
    <HeroBanner
      title={<>Connectez-vous à la santé, <span className="text-pink-500">consultez</span> en toute simplicité.</>}
      description="Lorem ipsum dolor sit amet consectetur. Augue enim risus erat eget tincidunt nibh enim. Placerat egeLorem ipsum dolor sit amet consectetur. Augue enim risus erat eget tincidunt nibh enim. Placerat egestas maecenas quisque posuere ut velit pulvinar sapien. stas maecenas quisque posuere ut velit pulvinar sapien."
      ctas={[
        { label: "Prendre rendez-vous" },
        { label: "Vous êtes praticien ?", className: "md:hidden" }
      ]}
    />
  </PageContainer>
}