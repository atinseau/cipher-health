import HeaderCard, { HeaderCardProps } from "../../Card/HeaderCard";
import PageItem from "../../Layout/PageItem";
import TutorialSteps, { TutorialStepsProps } from "./TutorialSteps";

type TutorialProps = HeaderCardProps & TutorialStepsProps

export default function Tutorial(props: TutorialProps) {

  return <PageItem autoSpacing>
    <HeaderCard
      title={props.title}
      surTitle={props.surTitle}
      description={props.description}
      className="mb-12"
    />
    <TutorialSteps steps={props.steps} />
  </PageItem>

}