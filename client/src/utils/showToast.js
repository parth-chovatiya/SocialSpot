import { useToast } from '@chakra-ui/react';

const Toast = () => {
  const toast = useToast();

  const showToast = details => {
    toast({
      ...details,
      duration: 3000,
      isClosable: true,
      position: 'bottom-right',
      variant:
        localStorage.getItem('chakra-ui-color-mode') === 'light'
          ? 'subtle'
          : 'solid',
    });
  };

  return [toast, showToast];
};

export default Toast;