import React, { useEffect, useState, ReactNode } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Transition } from "react-transition-group";

interface FadeInWrapperProps {
  children: ReactNode;
}

const FadeInWrapper: React.FC<FadeInWrapperProps> = ({ children }) => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Simulating the page load delay with a setTimeout
    const delay = 1; // 0.001 seconds
    const timeoutId = setTimeout(() => {
      setIsPageLoaded(true);
    }, delay);

    // Clear the timeout on component unmount
    return () => clearTimeout(timeoutId);
  }, [location.key]); // Trigger effect on route change

  return (
    <Transition in={isPageLoaded} timeout={200}>
      {(state) => (
        <div
          style={{
            opacity: state === "entered" ? 1 : 0,
            transition: "opacity 1s ease-in-out"
          }}
        >
          {children}
        </div>
      )}
    </Transition>
  );
};

export default FadeInWrapper;
