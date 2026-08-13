"use client";

import React from "react";

interface StepperProps {
  currentStep: number;
  totalSteps?: number;
  onStepClick?: (step: number) => void;
}

export function Stepper({
  currentStep,
  totalSteps = 6,
  onStepClick,
}: StepperProps) {
  return (
    <div className="w-full space-y-3">
      {/* Step Indicator Text */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-wider text-purple-400 uppercase">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      {/* 6 Clean Segmented Progress Bars (as in reference design) */}
      <div className="grid grid-cols-6 gap-2 sm:gap-3">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isCompletedOrActive = currentStep >= stepNumber;
          const isCurrent = currentStep === stepNumber;

          return (
            <div
              key={stepNumber}
              onClick={() => onStepClick && stepNumber < currentStep && onStepClick(stepNumber)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isCompletedOrActive
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500 shadow-sm shadow-purple-500/40"
                  : "bg-white/10"
              } ${stepNumber < currentStep ? "cursor-pointer hover:opacity-80" : ""}`}
            />
          );
        })}
      </div>
    </div>
  );
}
