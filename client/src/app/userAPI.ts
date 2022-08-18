export function authorization(url: string, body: any) {
   try {
      return fetch(url, {
         method: "POST",
         body: body,
         headers: {
            "Content-Type": "application/json"
         }
      })
   } catch (exception: any) {
      console.error("\x1b[40m\x1b[31m\x1b[1m", exception.message);
   }
}

export function checkAuthorization(url: string, token: string) {
   try {
      return fetch(url, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
         }
      })
   } catch (exception: any) {
      console.error("\x1b[40m\x1b[31m\x1b[1m", exception.message);
   }
}

