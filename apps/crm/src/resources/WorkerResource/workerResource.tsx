import { Resource, ResourceProps } from "react-admin";
import WorkerList from "./components/List";



export const config: ResourceProps = {
  name: 'worker',
  options: {
    label: 'Médecins'
  },
  list: WorkerList,
}


export const workerResource = <>
  <Resource {...config} />
</>