import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

interface HorizontalLinearStepperProps {
  activeStep: number; // Accept activeStep as a prop
}

const steps = ['Preferences', 'Festivals', 'Packages' , 'Checkout'];

export default function HorizontalLinearStepper({ activeStep }: HorizontalLinearStepperProps) {

  return (
    <Box sx={{ width: '75%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {}
          return (
            <Step key={label} {...stepProps} onClick={() => activeStep =index} >
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}
