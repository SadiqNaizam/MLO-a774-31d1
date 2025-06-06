import React from 'react';
import { CheckCircle, Circle, Truck, Package, CookingPot } from 'lucide-react'; // Example icons
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  name: string;
  icon?: React.ElementType;
}

interface OrderStatusStepperProps {
  steps: Step[];
  currentStepId: string;
  className?: string;
}

// Default steps if not provided, matching user journey
const defaultSteps: Step[] = [
  { id: 'placed', name: 'Order Placed', icon: Package },
  { id: 'confirmed', name: 'Confirmed', icon: CheckCircle },
  { id: 'preparing', name: 'Preparing Food', icon: CookingPot },
  { id: 'delivery', name: 'Out for Delivery', icon: Truck },
  { id: 'delivered', name: 'Delivered', icon: CheckCircle },
];


const OrderStatusStepper: React.FC<OrderStatusStepperProps> = ({
  steps = defaultSteps,
  currentStepId,
  className,
}) => {
  console.log("Rendering OrderStatusStepper. Current step ID:", currentStepId);

  const currentStepIndex = steps.findIndex(step => step.id === currentStepId);

  if (currentStepIndex === -1) {
    console.warn("OrderStatusStepper: currentStepId not found in steps array.");
    return <div className="text-red-500">Error: Invalid current step.</div>;
  }

  return (
    <div className={cn("w-full px-2 sm:px-0", className)}>
      <div className="flex items-start sm:items-center">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          const IconComponent = step.icon || Circle;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center text-center sm:min-w-[80px] md:min-w-[100px]">
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2",
                    isActive ? "bg-primary border-primary text-primary-foreground" : "",
                    isCompleted ? "bg-green-500 border-green-500 text-white" : "",
                    !isActive && !isCompleted ? "bg-muted border-muted-foreground/30 text-muted-foreground" : ""
                  )}
                >
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <p
                  className={cn(
                    "mt-1 text-xs sm:text-sm font-medium break-words w-full px-1",
                    isActive ? "text-primary" : "text-muted-foreground",
                    isCompleted ? "text-green-600" : ""
                  )}
                >
                  {step.name}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mt-4 sm:mt-5",
                    isCompleted ? "bg-green-500" : "bg-muted-foreground/30"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusStepper;