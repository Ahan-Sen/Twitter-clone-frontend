import React, { useContext, useEffect, useState } from "react";


const MobileContext = React.createContext(false);

export function useMobile() {
  return useContext(MobileContext);
}

export function MobileProvider({ children }:any) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        handleResize();
        removeListners();
    }, []);

    function removeListners() {
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }

    function handleResize() {
        if (window.innerWidth <= 992) {
            document.body.classList.add("mobileDevice");
            setIsMobile(true);
        } else {
            document.body.classList.remove("mobileDevice");
            setIsMobile(false);
        }
    }

  return (
    <MobileContext.Provider value={ isMobile }>
      {children}
    </MobileContext.Provider>
  );
}
