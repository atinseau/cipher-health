import CustomPage from "../../../../components/CustomPage";
import Registration from "./Steps/Registration";



export default function Signup() {

  return <CustomPage isBooted={true}>
    <Registration />
  </CustomPage>

}