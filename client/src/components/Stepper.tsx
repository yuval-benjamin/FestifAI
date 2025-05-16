import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';

const steps = ['Preferences', 'Festivals', 'Packages' , 'Checkout'];

export default function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} sx={{color: 'pink'}}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {}
          return (
            <Step key={label} {...stepProps} onClick={() => setActiveStep(index)} sx={{
                cursor: 'pointer',
                '& .MuiStepLabel-label': { color: 'white', fontFamily: 'Bangers', fontSize: '1.5rem' }, // Label font
                 // Label color
                '& .MuiStepIcon-root': { color: activeStep >= index ? '#FF3366' : 'gray' }, // Icon color
                '& .MuiStepIcon-text': { fontFamily: 'Bangers' }, // Icon text color
                '& .MuiStepIcon-completed': { color: '#FF3366' }, // Completed icon color
                '& .MuiStepIcon-active': { color: '#FF3366' }, // Active icon color
                '& .MuiStepLabel-root:hover': { color: 'white', cursor:'pointer' }, // Step label hover color
                '&.MuiStep-root': { backdropFilter: 'blur(5px)', // Apply blur effect
                backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent background
                borderRadius: '10px' }}}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (<></>
      )}
    </Box>
  );
}
