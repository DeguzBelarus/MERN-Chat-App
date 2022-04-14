import { useState, useCallback } from "react";

export const useForm = () => {
   const [loading, setLoading]: any = useState(false);
   const [message, setMessage]: any = useState("");

   const request = useCallback(
      async (url: string, method = "GET", body: any = null, headers: any = {}) => {
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
               throw new Error(data.message || "An error has occurred");
            }

            setLoading(false);
            return data;
         } catch (e: any) {
            setLoading(false);
            setMessage(e.message);
            throw e;
         }
      }, []
   );

   return { loading, request, message, setMessage };
};
