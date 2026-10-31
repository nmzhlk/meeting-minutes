import { useEffect } from 'react';

const APP_NAME = 'Meeting Minutes';

export const useDocumentTitle = (pageTitle?: string) => {
  useEffect(() => {
    if (pageTitle && pageTitle.trim()) {
      document.title = `${pageTitle.trim()} | ${APP_NAME}`;
    } else {
      document.title = APP_NAME;
    }
  }, [pageTitle]);
};
