'use client';

import { useMount } from "@cipher-health/utils/react";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export type TutorialStepsProps = {
  steps: Array<{
    title: string
    description: string | JSX.Element
    image: string
  }>
}

export default function TutorialSteps(props: TutorialStepsProps) {

  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((step) => {
        if (step + 1 >= props.steps.length) return 0
        return step + 1
      })
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return <div className="flex min-h-[550px] items-center xl:px-[72px] relative">
    <ul className="flex flex-col gap-10 lg:gap-4 lg:max-w-[calc(100%-500px-48px)]">
      {props.steps.map((step, index) => <li onClick={() => setCurrentStep(index)} key={index} className={clsx("transition-all rounded-2xl flex flex-col-reverse items-center lg:flex-row", {
        "lg:shadow-[0px_0px_5px_0px_rgba(115,73,214,0.15)]": currentStep === index
      })}>
        <div className="flex flex-col items-center lg:flex-row gap-6 lg:p-4 cursor-pointer">
          <span className={twMerge(clsx("transition-all bg-indigo-300 text-indigo-500 lg:bg-gray-400 lg:text-gray-500 text-lg font-bold flex justify-center items-center rounded-full min-w-[48px] w-[48px] h-[48px]", {
            "lg:bg-indigo-300 lg:text-indigo-500": currentStep === index,
          }))}>{index + 1}</span>
          <div className="text-center lg:text-left">
            <h3 className={twMerge(clsx("transition-all mb-2 text-indigo-500 lg:text-gray-500", {
              "lg:text-indigo-500": currentStep === index
            }))}>
              {step.title}
            </h3>
            <p className={twMerge(clsx("transition-all text-gray-600 lg:text-gray-500", {
              "lg:text-gray-600": currentStep === index
            }))}>
              {step.description}
            </p>
          </div>
        </div>

        <Image
          src={step.image}
          alt="Image d'une étape du tutoriel"
          className={twMerge(clsx("lg:!absolute lg:hidden lg:top-0 lg:right-0 xl:right-[72px]", { "lg:block": currentStep === index }))}
          width={500}
          height={550}
        />
      </li>)}
    </ul>
  </div>

}