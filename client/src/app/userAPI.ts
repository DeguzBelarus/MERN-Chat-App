export function authorization(url: string, body: any) {
   try {
      return fetch(url, {
         method: "POST",
         body: body,
         headers: {
            "Content-Type": "application/json"
         }
      })
   } catch (error: any) {
      throw error
   }
}

