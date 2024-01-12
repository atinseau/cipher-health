import { useContext } from "react";
import { AuthentificatorContext } from "../contexts/AuthentificatorProvider";


export default function useAuthentificator() {
  const authentificatorContext = useContext(AuthentificatorContext)
  return authentificatorContext.authentificator
}