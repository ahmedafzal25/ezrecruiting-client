import { useEffect } from 'react';

export const useTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${title} | ATS`;
    return () => { document.title = prevTitle; };
  }, [title]);
};
