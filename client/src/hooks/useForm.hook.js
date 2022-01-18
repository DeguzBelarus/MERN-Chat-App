import { useState, useCallback } from "react";

export const useForm = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const request = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setLoading(true);
      try {
        if (body) {
          body = JSON.stringify(body);
          headers["Content-Type"] = "application/json";
        }

        const response = await fetch(url, { method, body, headers });
        const data = await response.json();

        setMessage(data.message);

        if (!response.ok) {
          throw new Error(data.message || "Произошла ошибка");
        }

        setLoading(false);
        return data;
      } catch (e) {
        setLoading(false);
        setMessage(e.message);

        throw e;
      }
    },
    []
  );

  const clearMessage = useCallback(() => {
    setMessage(null);
  }, []);

  return { loading, request, message, clearMessage, setMessage };
};
