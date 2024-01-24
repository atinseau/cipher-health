import Actualities from "@/components/Content/Actualities";
import Banner from "@/components/Content/Banner";
import Partners from "@/components/Content/Partners";
import SectionDelimiter from "@/components/Content/SectionDelimiter";
import Security from "@/components/Content/Security";
import Services from "@/components/Content/Services";
import Tutorial from "@/components/Content/Tutorial/Tutorial";
import ChildIcon from "@/components/Icons/ChildIcon";
import DoctorIcon from "@/components/Icons/DoctorIcon";
import HomeIcon from "@/components/Icons/HomeIcon";
import MedicIcon from "@/components/Icons/MedicIcon";
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
    <div className="py-8 flex flex-col">
      <Services
        surTitle="Lorem ipsum dolor"
        title="Lorem ipsum dolor sit amet consectetur. "
        description={"Lorem ipsum dolor sit amet consectetur. Ipsum eget in odio viverra non dui pellentesque sed sagittis. Lorem ipsum dolor sit amet consectetur. Ipsum eget in odio viverraLorem ipsum dolor sit amet consectetur. Ipsum eget in odio viverra non dui pellentesque sed sagittis."}
        services={[
          {
            title: "Consultez un médecin en ligne 24h/24",
            description: "Lorem ipsum dolor sit amet consectetur. Ipsum eget in odio viverra non dui pellentesque sed ",
            icon: <DoctorIcon />,
            href: "/"
          },
          {
            title: "Prenez RDV avec un pédiatre 7j/7",
            description: "Lorem ipsum dolor sit amet consectetur. Ipsum eget in odio viverra non dui pellentesque sed ",
            icon: <ChildIcon />
          },
          {
            title: "Obtenez votre ordonnance rapidement",
            description: "Lorem ipsum dolor sit amet consectetur. Ipsum eget in odio viverra non dui pellentesque sed ",
            icon: <MedicIcon />
          },
          {
            title: "Un médecin se déplace à votre domicile",
            description: "Lorem ipsum dolor sit amet consectetur. Ipsum eget in odio viverra non dui pellentesque sed ",
            icon: <HomeIcon />
          }
        ]}
      />

      <Banner
        surTitle="Lorem ipsum dolor"
        title="Lorem ipsum dolor sit amet consectetur. "
        description="Lorem ipsum dolor sit amet consectetur. In vestibulum tincidunt nisl rhoncus magna magna quam aliquam gravida. Bibendum blandit mauris eget bibendum tempor. Venenatis aliquam nisi blandit facilisis fermentum. Pellentesque adipiscing vulputate ultrices sollicitudin sit."
        cta={{
          href: "/",
          label: "Prendre rendez-vous"
        }}
        links={[
          {
            title: "Lorem ipsum dolor sit amet consectetur",
            description: "Lorem ipsum dolor sit amet consectetur. In vestibulum tincidunt nisl",
            href: "/"
          },
          {
            title: "Lorem ipsum dolor sit amet consectetur",
            description: "Lorem ipsum dolor sit amet consectetur. In vestibulum tincidunt nisl",
            href: "/"
          },
          {
            title: "Lorem ipsum dolor sit amet consectetur",
            description: "Lorem ipsum dolor sit amet consectetur. In vestibulum tincidunt nisl",
            href: "/"
          },
          {
            title: "Lorem ipsum dolor sit amet consectetur",
            description: "Lorem ipsum dolor sit amet consectetur. In vestibulum tincidunt nisl",
            href: "/"
          }
        ]}
      />

      <Tutorial
        surTitle="Lorem ipsum dolor"
        title="Lorem ipsum dolor sit amet consectetur. "
        description={"Lorem ipsum dolor sit amet consectetur. Ipsum eget in odio viverra non dui pellentesque sed sagittis. Lorem ipsum dolor sit amet consectetur. Ipsum eget in odio viverraLorem ipsum dolor sit amet consectetur. Ipsum eget in odio viverra non dui pellentesque sed sagittis."}
        steps={[
          {
            title: 'Créer votre espace médical',
            description: 'Lorem ipsum dolor sit amet consectetur. Ipsum eget in odio viverra non dui pellentesque sed. Lorem ipsum dolor sit amet consectetur. Ipsum eget in',
            image: '/assets/images/tuto-1.png'
          },
          {
            title: 'Effectuez votre rendez-vous avec le médecin',
            description: 'Lorem ipsum dolor sit amet consectetur. Ipsum eget in odio viverra non dui pellentesque sed. Lorem ipsum dolor sit amet consectetur. Ipsum eget in',
            image: '/assets/images/tuto-2.png'
          },
          {
            title: 'Obtenez votre ordonnance et votre remboursement',
            description: 'Lorem ipsum dolor sit amet consectetur. Ipsum eget in odio viverra non dui pellentesque sed. Lorem ipsum dolor sit amet consectetur. Ipsum eget in',
            image: '/assets/images/tuto-3.png'
          }
        ]}
      />

      <Security
        title="La protection des données et documents."
        description="Lorem ipsum dolor sit amet consectetur. In vestibulum tincidunt nisl rhoncus magna magna quam aliquam gravida. Bibendum blandit mauris eget bibendum tempor. Venenatis aliquam nisi blandit facilisis fermentum. Pellentesque adipiscing vulputate ultrices sollicitudin sit.Lorem ipsum dolor sit amet consectetur. In vestibulum tincidunt nisl rhoncus magna magna quam aliquam gravida."
      />

      <SectionDelimiter src="/assets/images/home-footer.png" />

      <Actualities
        title="Nos actualités"
        cta={{
          label: "Voir plus d’articles",
          href: "/"
        }}
        actualities={[
          {
            title: "Lorem ipsum dolor sit amet consectetur.",
            description: "Lorem ipsum dolor sit amet consectetur. Purus semper ornare cursus adipiscing pulvinar tellus orci. Sed nisi sed molestie lacus interdum urna.",
            categories: [
              { label: 'Catégorie 1' }
            ],
            href: '/',
            image: '/assets/images/placeholder/actu-1.png'
          },
          {
            title: "Lorem ipsum dolor sit amet consectetur.",
            description: "Lorem ipsum dolor sit amet consectetur. Purus semper ornare cursus adipiscing pulvinar tellus orci. Sed nisi sed molestie lacus interdum urna.",
            categories: [
              { label: 'Catégorie 1', color: 'pink' }
            ],
            href: '/',
            image: '/assets/images/placeholder/actu-1.png'
          },
          {
            title: "Lorem ipsum dolor sit amet consectetur.",
            description: "Lorem ipsum dolor sit amet consectetur. Purus semper ornare cursus adipiscing pulvinar tellus orci. Sed nisi sed molestie lacus interdum urna.",
            categories: [
              { label: 'Catégorie 1', color: 'purple' }
            ],
            href: '/',
            image: '/assets/images/placeholder/actu-1.png'
          }
        ]}
      />

      <Partners
        title="Nos partenaires"
        partners={[
          {
            alt: "Partenaire 1",
            image: "/assets/images/placeholder/french-tech.png"
          },
          {
            alt: "Partenaire 2",
            image: "/assets/images/placeholder/boticinal.png"
          },
          {
            alt: "Partenaire 3",
            image: "/assets/images/placeholder/bpi.png"
          },
          {
            alt: "Partenaire 4",
            image: "/assets/images/placeholder/quotidien-du-medecin.png"
          }
        ]}
      />

    </div>
  </PageContainer>
}