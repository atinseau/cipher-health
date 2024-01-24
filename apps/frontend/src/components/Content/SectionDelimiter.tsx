import Image from "next/image";
import PageItem from "../Layout/PageItem";

type SectionDelimiterProps = {
  src: string;
}

export default function SectionDelimiter(props: SectionDelimiterProps) {
  return <PageItem
    className="relative"
    autoSpacing
    fullWidth
  >
    <Image
      width={385}
      height={429}
      src="/assets/svg/shape-home-1.svg"
      alt="Svg pour la séparation entre deux sections"
      className="absolute rotate-[133deg] left-[8%] top-[9%] max-w-[385px] w-[29%]"
    />
    <Image
      src={props.src}
      alt="Image de séparation entre deux sections"
      className="w-full h-[225px] md:h-[600px] object-cover object-top"
      width={1440}
      height={900}
    />
    <Image
      width={257}
      height={385}
      alt="Svg pour la séparation entre deux sections"
      src="/assets/svg/half-circle.svg"
      className="absolute right-0 top-[78%] max-h-[385px] h-[44%] w-fit"
    />
  </PageItem>
}