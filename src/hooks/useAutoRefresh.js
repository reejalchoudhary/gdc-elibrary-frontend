import { useEffect } from "react";

export default function useAutoRefresh(callback, interval = 5000) {

  useEffect(() => {

    callback();

    const timer = setInterval(() => {

      if (!document.hidden) {
        callback();
      }

    }, interval);

    return () => clearInterval(timer);

  }, []);
}