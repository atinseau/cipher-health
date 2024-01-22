import Header from "./Header";



type PageContainerProps = {
  children: React.ReactNode;
}

export default function PageContainer({ children }: PageContainerProps) {
  return <div className="flex flex-col items-center mx-auto">
    <Header />
    {children}
  </div>
}